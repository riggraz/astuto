class Post < ApplicationRecord
  include TenantOwnable
  include ApplicationHelper
  include Rails.application.routes.url_helpers
  extend FriendlyId
  
  belongs_to :board
  belongs_to :user, optional: true
  belongs_to :post_status, optional: true

  has_many :likes, dependent: :destroy
  has_many :follows, dependent: :destroy
  has_many :followers, through: :follows, source: :user
  has_many :comments, dependent: :destroy
  has_many :post_status_changes, dependent: :destroy

  has_many_attached :attachments

  after_create :run_new_post_webhooks
  after_destroy :run_delete_post_webhooks

  enum approval_status: [
    :approved,
    :pending,
    :rejected
  ] 

  validates :title, presence: true, length: { in: 4..128 }
  validates :attachments,
    content_type: Rails.application.accepted_image_types,
    size: { less_than: 2048.kilobytes },
    limit: { max: 5 }

  paginates_per Rails.application.posts_per_page

  friendly_id :title, use: :scoped, scope: :tenant_id

  def url
    get_url_for(method(:post_url), resource: self)
  end

  class << self
    def find_with_post_status_in(post_statuses)
      where(post_status_id: post_statuses.pluck(:id))
    end

    def search_by_name_or_description(s)
      s = s || ''
      s = sanitize_sql_like(s)
      where("posts.title ILIKE ? OR posts.description ILIKE ?", "%#{s}%", "%#{s}%")
    end

    def order_by(sort_by)
      case sort_by
      when 'newest'
        order(created_at: :desc)
      when 'trending'
        order(hotness: :desc)
      when 'most_voted'
        order(likes_count: :desc)
      when 'oldest'
        order(created_at: :asc)
      else
        order(created_at: :desc)
      end
    end

    def pending
      where(approval_status: "pending")
    end
  end

  private

    def run_new_post_webhooks
      entities = {
        post: self.id,
        board: self.board.id
      }
      entities[:post_author] = self.user.id if self.user_id

      # New post (approved)
      if self.approval_status == 'approved'
        Webhook.where(trigger: :new_post, is_enabled: true).each do |webhook|        
          RunWebhook.perform_later(
            webhook_id: webhook.id,
            current_tenant_id: Current.tenant.id,
            entities: entities
          )
        end
      end

      # New post (pending approval)
      if self.approval_status == 'pending'
        Webhook.where(trigger: :new_post_pending_approval, is_enabled: true).each do |webhook|
          RunWebhook.perform_later(
            webhook_id: webhook.id,
            current_tenant_id: Current.tenant.id,
            entities: entities
          )
        end
      end
    end

    def run_delete_post_webhooks
      # Since the post has already been deleted from DB
      # we only provide its ID
      entities = { post_id: self.id }

      Webhook.where(trigger: :delete_post, is_enabled: true).each do |webhook|
        RunWebhook.perform_later(
          webhook_id: webhook.id,
          current_tenant_id: Current.tenant.id,
          entities: entities
        )
      end
    end
end
