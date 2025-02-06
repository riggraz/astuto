class PostPolicy < ApplicationPolicy
  def permitted_attributes_for_create
    [
      :title,
      :description,
      :attachments,
      :board_id,
    ]
  end

  def permitted_attributes_for_update
    if user.moderator?
      [:title, :description, :board_id, :post_status_id, :attachments, :approval_status]
    else
      [:title, :description, :attachments]
    end
  end

  def update?
    user == record.user or user.moderator?
  end

  def destroy?
    user == record.user or user.moderator?
  end
end