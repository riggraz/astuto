import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import { ISiteSettingsOAuthForm } from "../../components/SiteSettings/Authentication/OAuthForm";
import HttpStatus from "../../constants/http_status";
import buildRequestHeaders from "../../helpers/buildRequestHeaders";
import { IOAuthJSON } from "../../interfaces/IOAuth";
import { State } from "../../reducers/rootReducer";
import buildFormData from "../../helpers/buildFormData";

export const OAUTH_UPDATE_START = 'OAUTH_UPDATE_START';
interface OAuthUpdateStartAction {
  type: typeof OAUTH_UPDATE_START;
}

export const OAUTH_UPDATE_SUCCESS = 'OAUTH_UPDATE_SUCCESS';
interface OAuthUpdateSuccessAction {
  type: typeof OAUTH_UPDATE_SUCCESS;
  oAuth: IOAuthJSON;
}

export const OAUTH_UPDATE_FAILURE = 'OAUTH_UPDATE_FAILURE';
interface OAuthUpdateFailureAction {
  type: typeof OAUTH_UPDATE_FAILURE;
  error: string;
}

export type OAuthUpdateActionTypes =
  OAuthUpdateStartAction |
  OAuthUpdateSuccessAction |
  OAuthUpdateFailureAction;

const oAuthUpdateStart = (): OAuthUpdateStartAction => ({
  type: OAUTH_UPDATE_START,
});

const oAuthUpdateSuccess = (
  oAuthJSON: IOAuthJSON,
): OAuthUpdateSuccessAction => ({
  type: OAUTH_UPDATE_SUCCESS,
  oAuth: oAuthJSON,
});

const oAuthUpdateFailure = (error: string): OAuthUpdateFailureAction => ({
  type: OAUTH_UPDATE_FAILURE,
  error,
});

interface UpdateOAuthParams {
  id: number;
  form?: ISiteSettingsOAuthForm;
  isEnabled?: boolean;
  shouldDeleteLogo?: boolean;
  authenticityToken: string;
}

export const updateOAuth = ({
  id,
  form = null,
  isEnabled = null,
  shouldDeleteLogo = false,
  authenticityToken,
}: UpdateOAuthParams): ThunkAction<void, State, null, Action<string>> => async (dispatch) => {
  dispatch(oAuthUpdateStart());

  const o_auth = Object.assign({},
    form !== null ? {
      name: form.name,
      logo: form.logo ? form.logo : null,
      client_id: form.clientId,
      client_secret: form.clientSecret,
      authorize_url: form.authorizeUrl,
      token_url: form.tokenUrl,
      profile_url: form.profileUrl,
      scope: form.scope,
      json_user_email_path: form.jsonUserEmailPath,
      json_user_name_path: form.jsonUserNamePath,
    } : null,
    isEnabled !== null ? {is_enabled: isEnabled} : null,
  );

  let formDataObj = {};
  
  Object.entries(o_auth).forEach(([key, value]) => {
    formDataObj[`o_auth[${key}]`] = value;
  });
  formDataObj['o_auth[should_delete_logo]'] = shouldDeleteLogo.toString();

  const body = buildFormData(formDataObj);

  try {
    const res = await fetch(`/o_auths/${id}`, {
      method: 'PATCH',
      headers: { 'X-CSRF-Token': authenticityToken },
      body,
    });
    const json = await res.json();

    if (res.status === HttpStatus.OK) {
      dispatch(oAuthUpdateSuccess(json));
    } else {
      dispatch(oAuthUpdateFailure(json.error));
    }

    return Promise.resolve(res);
  } catch (e) {
    dispatch(oAuthUpdateFailure(e));
    
    return Promise.resolve(null);
  }
};