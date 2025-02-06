class TenantSettingPolicy < ApplicationPolicy
  def permitted_attributes_for_update
    if user.admin?
      [
        :brand_display,
        :use_browser_locale,
        :root_board_id,
        :is_private,
        :email_registration_policy,
        :allowed_email_domains,
        :allow_anonymous_feedback,
        :feedback_approval_policy,
        :allow_attachment_upload,
        :show_vote_count,
        :show_vote_button_in_board,
        :hide_unused_statuses_in_filter_by_status,
        :show_powered_by,
        :logo_links_to,
        :logo_custom_url,
        :show_roadmap_in_header,
        :collapse_boards_in_header,
        :custom_css,
      ]
    else
      []
    end
  end

  def update?
    user.admin? and user.tenant_id == record.id
  end
end