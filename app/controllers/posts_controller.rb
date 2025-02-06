class PostsController < ApplicationController
  before_action :authenticate_user!, only: [:update, :destroy]
  before_action :authenticate_moderator, only: [:moderation]
  before_action :authenticate_moderator_if_post_not_approved, only: [:show]
  before_action :check_tenant_subscription, only: [:create, :update, :destroy]

  def index
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.parse('1970-01-01')
    end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.today

    posts = Post
      .select(
        :id,
        :title,
        :slug,
        :description,
        :post_status_id,
        'COUNT(DISTINCT likes.id) AS likes_count',
        'COUNT(DISTINCT comments.id) AS comments_count',
        '((LOG(COUNT(DISTINCT likes.id) + 1) + LOG(COUNT(DISTINCT comments.id) + 1)) + (EXTRACT(EPOCH FROM posts.created_at) / 45000)) AS hotness',
        "(SELECT COUNT(*) AS liked FROM likes WHERE likes.user_id=#{current_user ? current_user.id : -1} AND likes.post_id=posts.id)"
      )
      .left_outer_joins(:likes)
      .left_outer_joins(:comments)
      .group('posts.id')
      .where(board_id: params[:board_id] || Board.first.id)
      .where(created_at: start_date.beginning_of_day..end_date.end_of_day)
      .where(approval_status: "approved")
      .search_by_name_or_description(params[:search])
      .order_by(params[:sort_by])
      .page(params[:page])

    # apply post status filter if present
    posts = posts.where(post_status_id: params[:post_status_ids].map { |id| id == "0" ? nil : id }) if params[:post_status_ids].present?

    # check if posts have attachments
    posts = posts.map do |post|
      post.attributes.merge(has_attachments: post.attachments.attached?)
    end
    
    render json: posts
  end

  def create
    if anti_spam_checks || invalid_anonymous_submission
      render json: {
        error: t('errors.unknown')
      }, status: :unprocessable_entity
      return
    end

    # handle anonymous feedback
    approval_status = "pending"
    is_anonymous = params[:post][:is_anonymous]

    if Current.tenant.tenant_setting.feedback_approval_policy == "never_require_approval" ||
      (Current.tenant.tenant_setting.feedback_approval_policy == "anonymous_require_approval" && !is_anonymous) ||
      (user_signed_in? && current_user.moderator?)
      approval_status = "approved"
    end

    @post = Post.new(approval_status: approval_status)
    @post.assign_attributes(post_create_params(is_anonymous: is_anonymous))

    # handle attachments
    if Current.tenant.tenant_setting.allow_attachment_upload && params[:post][:attachments].present? && !is_anonymous
      @post.attachments.attach(params[:post][:attachments])
    end

    if @post.save
      Follow.create(post_id: @post.id, user_id: current_user.id) unless is_anonymous
      
      render json: @post, status: :created
    else
      render json: {
        error: @post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def show
    @post = Post
      .friendly
      .select(
        :id,
        :title,
        :slug,
        :description,
        :approval_status,
        :board_id,
        :user_id,
        :post_status_id,
        :created_at,
        :updated_at,
        'users.email as user_email',
        'users.full_name as user_full_name'
      )
      .eager_load(:user) # left outer join
      .find(params[:id])

    @post_statuses = PostStatus.select(:id, :name, :color).order(order: :asc)
    @board = @post.board

    @page_title = @post.title.length > 60 ? @post.title.slice(0, 60) + "..." : @post.title

    respond_to do |format|
      format.html

      format.json { render json: @post.as_json.merge(attachment_urls: @post.attachments.order(:created_at).map { |attachment| attachment.blob.url }) }
    end
  end

  def update
    @post = Post.find(params[:id])
    authorize @post
    
    @post.assign_attributes(post_update_params)

    # handle attachment deletion
    if params[:post][:attachments_to_delete].present? && @post.attachments.attached?
      @post.attachments.order(:created_at).each_with_index do |attachment, index|
        attachment.purge if params[:post][:attachments_to_delete].include?(index.to_s)
      end
    end

    # handle attachments
    if Current.tenant.tenant_setting.allow_attachment_upload && params[:post][:attachments].present?
      @post.attachments.attach(params[:post][:attachments])
    end

    if @post.save
      if @post.post_status_id_previously_changed?
        ExecutePostStatusChangeLogicWorkflow.new(
          user_id: current_user.id,
          post: @post,
          post_status_id: @post.post_status_id
        ).run
      end

      render json: @post.as_json.merge(attachment_urls: @post.attachments.order(:created_at).map { |attachment| attachment.blob.url })
    else
      render json: {
        error: @post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @post = Post.find(params[:id])
    authorize @post

    if @post.destroy
      render json: {
        id: @post.id,
      }, status: :accepted
    else
      render json: {
        error: @post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # Returns a list of posts for moderation in JSON
  def moderation
    posts = Post
      .select(
        :id,
        :title,
        :description,
        :slug,
        :approval_status,
        :user_id,
        :board_id,
        :created_at,
        'users.id as user_id', # required for avatar_url
        'users.email as user_email',
        'users.full_name as user_full_name'
      )
      .eager_load(:user)
      .where(approval_status: ["pending", "rejected"])
      .order_by(created_at: :desc)
      .limit(100)
      .includes(user: { avatar_attachment: :blob }) # Preload avatars

      posts = posts.map do |post|
      user_avatar_url = post.user.avatar.attached? ? post.user.avatar.blob.url : nil
      post.attributes.merge(user_avatar: user_avatar_url)
    end

    render json: posts
  end

  private

    def authenticate_moderator_if_post_not_approved
      post = Post.friendly.find(params[:id])
      authenticate_moderator unless post.approval_status == "approved"
    end

    def anti_spam_checks
      params[:post][:dnf1] != "" || params[:post][:dnf2] != "" || Time.now.to_i - params[:post][:form_rendered_at] < 2
    end

    def invalid_anonymous_submission
      (params[:post][:is_anonymous] == false && !user_signed_in?) || (params[:post][:is_anonymous] == true && Current.tenant.tenant_setting.allow_anonymous_feedback == false)
    end
    
    def post_create_params(is_anonymous: false)
      params
        .require(:post)
        .permit(policy(@post).permitted_attributes_for_create)
        .merge(user_id: is_anonymous ? nil : current_user.id)
    end

    def post_update_params
      params
        .require(:post)
        .permit(
          policy(@post)
            .permitted_attributes_for_update
            .concat([{ additional_params: [:attachments_to_delete] }])
        )
    end
end
