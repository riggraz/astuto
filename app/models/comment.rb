class Comment < ApplicationRecord
  include TenantOwnable
  
  belongs_to :user
  belongs_to :post
  belongs_to :parent, class_name: 'Comment', optional: true
  
  has_many :children, class_name: 'Comment', foreign_key: 'parent_id', dependent: :destroy
  has_many_attached :attachments

  after_create :run_webhooks

  validates :body, presence: true
  validates :attachments,
    content_type: Rails.application.accepted_image_types,
    size: { less_than: 2048.kilobytes },
    limit: { max: 5 }

  private

  def run_webhooks
    entities = {
      comment: self.id,
      comment_author: self.user.id,
      post: self.post.id,
      board: self.post.board.id
    }
    entities[:post_author] = self.post.user.id if self.post.user_id

    Webhook.where(trigger: :new_comment, is_enabled: true).each do |webhook|        
      RunWebhook.perform_later(
        webhook_id: webhook.id,
        current_tenant_id: Current.tenant.id,
        entities: entities
      )
    end
  end
end
