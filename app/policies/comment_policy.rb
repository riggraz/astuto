class CommentPolicy < ApplicationPolicy
  def permitted_attributes_for_create
    if user.moderator?
      [:body, :parent_id, :is_post_update, :attachments]
    else
      [:body, :parent_id, :attachments]
    end
  end

  def permitted_attributes_for_update
    if user.moderator?
      [:body, :is_post_update, :attachments]
    else
      [:body, :attachments]
    end
  end

  def update?
    user == record.user or user.moderator?
  end

  def destroy?
    user == record.user or user.moderator?
  end
end