// Brand display setting
export const TENANT_SETTING_BRAND_DISPLAY_NAME_AND_LOGO = 'name_and_logo';
export const TENANT_SETTING_BRAND_DISPLAY_NAME_ONLY = 'name_only';
export const TENANT_SETTING_BRAND_DISPLAY_LOGO_ONLY = 'logo_only';
export const TENANT_SETTING_BRAND_DISPLAY_NONE = 'no_name_no_logo';

export type TenantSettingBrandDisplay =
  typeof TENANT_SETTING_BRAND_DISPLAY_NAME_AND_LOGO |
  typeof TENANT_SETTING_BRAND_DISPLAY_NAME_ONLY |
  typeof TENANT_SETTING_BRAND_DISPLAY_LOGO_ONLY |
  typeof TENANT_SETTING_BRAND_DISPLAY_NONE;

// Email registration policy
export const TENANT_SETTING_EMAIL_REGISTRATION_POLICY_ALL_ALLOWED = 'all_allowed';
export const TENANT_SETTING_EMAIL_REGISTRATION_POLICY_NONE_ALLOWED = 'none_allowed';
export const TENANT_SETTING_EMAIL_REGISTRATION_POLICY_CUSTOM_DOMAINS_ALLOWED = 'custom_domains_allowed';

export type TenantSettingEmailRegistrationPolicy =
  typeof TENANT_SETTING_EMAIL_REGISTRATION_POLICY_ALL_ALLOWED |
  typeof TENANT_SETTING_EMAIL_REGISTRATION_POLICY_NONE_ALLOWED |
  typeof TENANT_SETTING_EMAIL_REGISTRATION_POLICY_CUSTOM_DOMAINS_ALLOWED;

// Feedback approval policy
export const TENANT_SETTING_FEEDBACK_APPROVAL_POLICY_ANONYMOUS_REQUIRE_APPROVAL = 'anonymous_require_approval';
export const TENANT_SETTING_FEEDBACK_APPROVAL_POLICY_NEVER_REQUIRE_APPROVAL = 'never_require_approval';
export const TENANT_SETTING_FEEDBACK_APPROVAL_POLICY_ALWAYS_REQUIRE_APPROVAL = 'always_require_approval';

export type TenantSettingFeedbackApprovalPolicy =
  typeof TENANT_SETTING_FEEDBACK_APPROVAL_POLICY_ANONYMOUS_REQUIRE_APPROVAL |
  typeof TENANT_SETTING_FEEDBACK_APPROVAL_POLICY_NEVER_REQUIRE_APPROVAL |
  typeof TENANT_SETTING_FEEDBACK_APPROVAL_POLICY_ALWAYS_REQUIRE_APPROVAL;

// Logo links to
export const TENANT_SETTING_LOGO_LINKS_TO_ROOT_PAGE = 'root_page';
export const TENANT_SETTING_LOGO_LINKS_TO_CUSTOM_URL = 'custom_url';
export const TENANT_SETTING_LOGO_LINKS_TO_NOTHING = 'nothing';

export type TenantSettingLogoLinksTo =
  typeof TENANT_SETTING_LOGO_LINKS_TO_ROOT_PAGE |
  typeof TENANT_SETTING_LOGO_LINKS_TO_CUSTOM_URL |
  typeof TENANT_SETTING_LOGO_LINKS_TO_NOTHING;

// Collapse boards in header
export const TENANT_SETTING_COLLAPSE_BOARDS_IN_HEADER_NO_COLLAPSE = 'no_collapse';
export const TENANT_SETTING_COLLAPSE_BOARDS_IN_HEADER_ALWAYS_COLLAPSE = 'always_collapse';

export type TenantSettingCollapseBoardsInHeader =
  typeof TENANT_SETTING_COLLAPSE_BOARDS_IN_HEADER_NO_COLLAPSE |
  typeof TENANT_SETTING_COLLAPSE_BOARDS_IN_HEADER_ALWAYS_COLLAPSE;


interface ITenantSetting {
  brand_display?: TenantSettingBrandDisplay;
  use_browser_locale?: boolean;
  root_board_id?: number;
  is_private?: boolean;
  email_registration_policy?: TenantSettingEmailRegistrationPolicy;
  allowed_email_domains?: string;
  allow_anonymous_feedback?: boolean;
  feedback_approval_policy?: TenantSettingFeedbackApprovalPolicy;
  allow_attachment_upload?: boolean;
  show_vote_count?: boolean;
  show_vote_button_in_board?: boolean;
  show_roadmap_in_header?: boolean;
  hide_unused_statuses_in_filter_by_status?: boolean;
  show_powered_by?: boolean;
  collapse_boards_in_header?: TenantSettingCollapseBoardsInHeader;
  logo_links_to?: TenantSettingLogoLinksTo;
  logo_custom_url?: string;
  custom_css?: string;
}

export default ITenantSetting;