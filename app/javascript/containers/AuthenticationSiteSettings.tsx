import { connect } from "react-redux";
import { deleteOAuth } from "../actions/OAuth/deleteOAuth";
import { requestOAuths } from "../actions/OAuth/requestOAuths";
import { submitOAuth } from "../actions/OAuth/submitOAuth";
import { updateOAuth } from "../actions/OAuth/updateOAuth";

import AuthenticationSiteSettingsP from "../components/SiteSettings/Authentication/AuthenticationSiteSettingsP";
import { ISiteSettingsOAuthForm } from "../components/SiteSettings/Authentication/OAuthForm";
import { IOAuth } from "../interfaces/IOAuth";
import { State } from "../reducers/rootReducer";
import { updateDefaultOAuth } from "../actions/OAuth/updateDefaultOAuth";
import { TenantSettingEmailRegistrationPolicy } from "../interfaces/ITenantSetting";
import { updateTenant } from "../actions/Tenant/updateTenant";

const mapStateToProps = (state: State) => ({
  oAuths: state.oAuths,

  isSubmitting: state.siteSettings.authentication.isSubmitting,
  submitError: state.siteSettings.authentication.error,
});

const mapDispatchToProps = (dispatch: any) => ({
  requestOAuths() {
    dispatch(requestOAuths());
  },

  onSubmitOAuth(oAuth: IOAuth, oAuthLogo: File = null, authenticityToken: string): Promise<any> {
    return dispatch(submitOAuth(oAuth, oAuthLogo, authenticityToken));
  },

  onUpdateOAuth(id: number, form: ISiteSettingsOAuthForm, shouldDeleteLogo: boolean, authenticityToken: string): Promise<any> {
    return dispatch(updateOAuth({id, form, isEnabled: undefined, shouldDeleteLogo, authenticityToken}));
  },

  onToggleEnabledOAuth(id: number, isEnabled: boolean, authenticityToken: string) {
    dispatch(updateOAuth({id, isEnabled, authenticityToken}));
  },

  onToggleEnabledDefaultOAuth(id: number, isEnabled: boolean, authenticityToken: string) {
    dispatch(updateDefaultOAuth({id, isEnabled, authenticityToken}));
  },

  onDeleteOAuth(id: number, authenticityToken: string) {
    dispatch(deleteOAuth(id, authenticityToken));
  },

  onUpdateTenantSettings(
    emailRegistrationPolicy: TenantSettingEmailRegistrationPolicy,
    allowedEmailDomains: string,
    authenticityToken: string,
  ): Promise<any> {
    return dispatch(updateTenant({
      tenantSetting: {
        email_registration_policy: emailRegistrationPolicy,
        allowed_email_domains: allowedEmailDomains,
      },
      authenticityToken,
    }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthenticationSiteSettingsP);