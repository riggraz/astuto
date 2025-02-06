class CommentsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :check_tenant_subscription, only: [:create, :update, :destroy]

  def index
    comments = Comment
      .select(
        :id,
        :body,
        :parent_id,
        :is_post_update,
        :created_at,
        :updated_at,
        'users.id as user_id', # required for avatar_url
        'users.full_name as user_full_name',
        'users.email as user_email',
        'users.role as user_role',
      )
      .where(post_id: params[:post_id])
      .left_outer_joins(:user)
      .order(created_at: :desc)
      .includes(user: { avatar_attachment: :blob }) # Preload avatars

    comments = comments.map do |comment|
      user_avatar_url = comment.user.avatar.attached? ? comment.user.avatar.blob.url : nil
      attachment_urls = comment.attachments.order(:created_at).map { |attachment| attachment.blob.url }

      comment.attributes.merge(
        attachment_urls: attachment_urls,
        user_avatar: user_avatar_url
      )
    end

    render json: comments
  end

  def create
    @comment = Comment.new
    @comment.assign_attributes(comment_create_params)

    # handle attachments
    if Current.tenant.tenant_setting.allow_attachment_upload && params[:comment][:attachments].present?
      @comment.attachments.attach(params[:comment][:attachments])
    end

    if @comment.save
      SendNotificationForCommentWorkflow.new(comment: @comment).run

      render json: @comment.attributes.merge(
        {
          attachment_urls: @comment.attachments.order(:created_at).map { |attachment| attachment.blob.url },
          user_full_name: current_user.full_name,
          user_email: current_user.email,
          user_avatar: current_user.avatar.attached? ? current_user.avatar.blob.url : nil,
          user_role: current_user.role_before_type_cast
        }
      ), status: :created
    else
      render json: {
        error: @comment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update
    @comment = Comment.find(params[:id])
    authorize @comment

    @comment.assign_attributes(comment_update_params)

    # handle attachment deletion
    if params[:comment][:attachments_to_delete].present? && @comment.attachments.attached?
      @comment.attachments.order(:created_at).each_with_index do |attachment, index|
        attachment.purge if params[:comment][:attachments_to_delete].include?(index.to_s)
      end
    end

    # handle attachments
    if Current.tenant.tenant_setting.allow_attachment_upload && params[:comment][:attachments].present?
      @comment.attachments.attach(params[:comment][:attachments])
    end

    if @comment.save
      render json: @comment.attributes.merge(
        {
          attachment_urls: @comment.attachments.order(:created_at).map { |attachment| attachment.blob.url },
          user_full_name: @comment.user.full_name,
          user_email: @comment.user.email,
          user_avatar: @comment.user.avatar.attached? ? @comment.user.avatar.blob.url : nil,
          user_role: @comment.user.role_before_type_cast
        }
      )
    else
      render json: {
        error: @comment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    authorize @comment

    if @comment.destroy
      render json: {
        id: @comment.id,
      }, status: :accepted
    else
      render json: {
        error: @comment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

    def comment_create_params
      params
        .require(:comment)
        .permit(policy(@comment).permitted_attributes_for_create)
        .merge(
          user_id: current_user.id,
          post_id: params[:post_id]
        )
    end

    def comment_update_params
      params
        .require(:comment)
        .permit(policy(@comment).permitted_attributes_for_update)
    end
end
