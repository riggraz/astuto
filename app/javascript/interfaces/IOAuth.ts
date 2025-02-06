export interface IOAuth {
  id?: number;
  name: string;
  logoUrl?: string;
  isEnabled: boolean;
  clientId: string;
  clientSecret?: string;
  authorizeUrl: string;
  tokenUrl: string;
  profileUrl: string;
  scope: string;
  jsonUserEmailPath: string;
  jsonUserNamePath?: string;
  
  callbackUrl?: string;
  tenantId?: number;
  defaultOAuthIsEnabled?: boolean;
}

export interface IOAuthJSON {
  id: string;
  name: string;
  logo_url?: string;
  is_enabled: boolean;
  client_id: string;
  client_secret?: string;
  authorize_url: string;
  token_url: string;
  profile_url: string;
  scope: string;
  json_user_email_path: string;
  json_user_name_path?: string;

  callback_url?: string;
  tenant_id?: string;
  default_o_auth_is_enabled?: boolean;
}

export const oAuthJSON2JS = (oAuthJSON: IOAuthJSON): IOAuth => ({
  id: parseInt(oAuthJSON.id),
  name: oAuthJSON.name,
  logoUrl: oAuthJSON.logo_url,
  isEnabled: oAuthJSON.is_enabled,
  clientId: oAuthJSON.client_id,
  clientSecret: oAuthJSON.client_secret,
  authorizeUrl: oAuthJSON.authorize_url,
  tokenUrl: oAuthJSON.token_url,
  scope: oAuthJSON.scope,
  profileUrl: oAuthJSON.profile_url,
  jsonUserEmailPath: oAuthJSON.json_user_email_path,
  jsonUserNamePath: oAuthJSON.json_user_name_path,

  callbackUrl: oAuthJSON.callback_url,
  tenantId: oAuthJSON.tenant_id ? parseInt(oAuthJSON.tenant_id) : null,
  defaultOAuthIsEnabled: oAuthJSON.default_o_auth_is_enabled,
});

export const oAuthJS2JSON = (oAuth: IOAuth) => ({
  id: oAuth.id?.toString(),
  name: oAuth.name,
  logo_url: oAuth.logoUrl,
  is_enabled: oAuth.isEnabled,
  client_id: oAuth.clientId,
  client_secret: oAuth.clientSecret,
  authorize_url: oAuth.authorizeUrl,
  token_url: oAuth.tokenUrl,
  profile_url: oAuth.profileUrl,
  scope: oAuth.scope,
  json_user_email_path: oAuth.jsonUserEmailPath,
  json_user_name_path: oAuth.jsonUserNamePath,

  callback_url: oAuth.callbackUrl,
  tenant_id: oAuth.tenantId,
  default_o_auth_is_enabled: oAuth.defaultOAuthIsEnabled,
});