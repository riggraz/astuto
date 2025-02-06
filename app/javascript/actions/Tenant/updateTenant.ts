import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import HttpStatus from "../../constants/http_status";
import ITenantSetting from "../../interfaces/ITenantSetting";
import ITenantJSON from "../../interfaces/json/ITenant";
import { State } from "../../reducers/rootReducer";
import buildFormData from "../../helpers/buildFormData";

export const TENANT_UPDATE_START = 'TENANT_UPDATE_START';
interface TenantUpdateStartAction {
  type: typeof TENANT_UPDATE_START;
}

export const TENANT_UPDATE_SUCCESS = 'TENANT_UPDATE_SUCCESS';
interface TenantUpdateSuccessAction {
  type: typeof TENANT_UPDATE_SUCCESS;
  tenant: ITenantJSON;
}

export const TENANT_UPDATE_FAILURE = 'TENANT_UPDATE_FAILURE';
interface TenantUpdateFailureAction {
  type: typeof TENANT_UPDATE_FAILURE;
  error: string;
}

export type TenantUpdateActionTypes =
  TenantUpdateStartAction |
  TenantUpdateSuccessAction |
  TenantUpdateFailureAction;

const tenantUpdateStart = (): TenantUpdateStartAction => ({
  type: TENANT_UPDATE_START,
});

const tenantUpdateSuccess = (
  tenantJSON: ITenantJSON,
): TenantUpdateSuccessAction => ({
  type: TENANT_UPDATE_SUCCESS,
  tenant: tenantJSON,
});

const tenantUpdateFailure = (error: string): TenantUpdateFailureAction => ({
  type: TENANT_UPDATE_FAILURE,
  error,
});

interface UpdateTenantParams {
  siteName?: string;
  siteLogo?: File;
  shouldDeleteSiteLogo?: boolean;
  oldSiteLogo?: string;
  siteFavicon?: File;
  shouldDeleteSiteFavicon?: boolean;
  tenantSetting?: ITenantSetting;
  locale?: string;
  customDomain?: string;
  authenticityToken: string;
}

export const updateTenant = ({
  siteName = null,
  siteLogo = null,
  shouldDeleteSiteLogo = null,
  oldSiteLogo = null,
  siteFavicon = null,
  shouldDeleteSiteFavicon = null,
  tenantSetting = null,
  locale = null,
  customDomain = null,
  authenticityToken,
}: UpdateTenantParams): ThunkAction<void, State, null, Action<string>> => async (dispatch) => {
  dispatch(tenantUpdateStart());

  try {
    let formDataObj = {
      'tenant[site_name]': siteName,
      'tenant[site_logo]': siteLogo,
      'tenant[should_delete_site_logo]': shouldDeleteSiteLogo.toString(),
      'tenant[old_site_logo]': oldSiteLogo,
      'tenant[site_favicon]': siteFavicon,
      'tenant[should_delete_site_favicon]': shouldDeleteSiteFavicon.toString(),
      'tenant[locale]': locale,
      'tenant[custom_domain]': customDomain,
    }

    if (tenantSetting) {
      Object.entries(tenantSetting).forEach(([key, value]) => {
        formDataObj[`tenant[tenant_setting_attributes][${key}]`] = value;
      });
    }
    
    const body = buildFormData(formDataObj);

    const res = await fetch(`/tenants/0`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': authenticityToken,
        // do not set Content-Type header when using FormData
      },
      body,
    });
    const json = await res.json();

    if (res.status === HttpStatus.OK) {
      dispatch(tenantUpdateSuccess(json));
    } else {
      dispatch(tenantUpdateFailure(json.error));
    }

    return Promise.resolve(res);
  } catch (e) {
    dispatch(tenantUpdateFailure(e));
    
    return Promise.resolve(null);
  }
};