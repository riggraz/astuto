import * as React from 'react';
import { useState, useEffect } from 'react';

import HttpStatus from '../../../constants/http_status';
import { IOAuth } from '../../../interfaces/IOAuth';
import { OAuthsState } from '../../../reducers/oAuthsReducer';

import AuthenticationFormPage from './AuthenticationFormPage';
import AuthenticationIndexPage, { IAuthenticationForm } from './AuthenticationIndexPage';
import { ISiteSettingsOAuthForm } from './OAuthForm';
import { TenantSettingEmailRegistrationPolicy } from '../../../interfaces/ITenantSetting';

interface Props {
  originForm: IAuthenticationForm;

  oAuths: OAuthsState;

  requestOAuths(): void;
  onSubmitOAuth(oAuth: IOAuth, oAuthLogo: File, authenticityToken: string): Promise<any>;
  onUpdateOAuth(id: number, form: ISiteSettingsOAuthForm, shouldDeleteLogo: boolean, authenticityToken: string): Promise<any>;
  onToggleEnabledOAuth(id: number, isEnabled: boolean, authenticityToken: string): void;
  onToggleEnabledDefaultOAuth(id: number, isEnabled: boolean, authenticityToken: string): void;
  onDeleteOAuth(id: number, authenticityToken: string): void;
  onUpdateTenantSettings(emailRegistrationPolicy: TenantSettingEmailRegistrationPolicy, allowedEmailDomains: string, authenticityToken: string): Promise<any>;

  isSubmitting: boolean;
  submitError: string;

  authenticityToken: string;
}

export type AuthenticationPages = 'index' | 'new' | 'edit';

const AuthenticationSiteSettingsP = ({
  originForm,
  oAuths,
  requestOAuths,
  onSubmitOAuth,
  onUpdateOAuth,
  onToggleEnabledOAuth,
  onToggleEnabledDefaultOAuth,
  onDeleteOAuth,
  onUpdateTenantSettings,
  isSubmitting,
  submitError,
  authenticityToken,
}: Props) => {
  const [page, setPage] = useState<AuthenticationPages>('index');
  const [selectedOAuth, setSelectedOAuth] = useState<number>(null);

  useEffect(requestOAuths, []);

  const handleSubmitOAuth = (oAuth: IOAuth, oAuthLogo: File) => {
    onSubmitOAuth(oAuth, oAuthLogo, authenticityToken).then(res => {
      if (res?.status === HttpStatus.Created) setPage('index');
    });
  };

  const handleUpdateOAuth = (id: number, form: ISiteSettingsOAuthForm, shouldDeleteLogo: boolean) => {
    onUpdateOAuth(id, form, shouldDeleteLogo, authenticityToken).then(res => {
      if (res?.status === HttpStatus.OK) setPage('index');
    });
  };

  const handleToggleEnabledOAuth = (id: number, enabled: boolean) => {
    onToggleEnabledOAuth(id, enabled, authenticityToken);
  };

  const handleToggleEnabledDefaultOAuth = (id: number, enabled: boolean) => {
    onToggleEnabledDefaultOAuth(id, enabled, authenticityToken);
  };

  const handleDeleteOAuth = (id: number) => {
    onDeleteOAuth(id, authenticityToken);
  };

  const handleUpdateTenantSettings = (emailRegistrationPolicy: TenantSettingEmailRegistrationPolicy, allowedEmailDomains: string): Promise<any> => {
    return onUpdateTenantSettings(emailRegistrationPolicy, allowedEmailDomains, authenticityToken);
  }

  return (
    page === 'index' ?
      <AuthenticationIndexPage
        originForm={originForm}
        oAuths={oAuths}
        handleToggleEnabledOAuth={handleToggleEnabledOAuth}
        handleToggleEnabledDefaultOAuth={handleToggleEnabledDefaultOAuth}
        handleDeleteOAuth={handleDeleteOAuth}
        handleUpdateTenantSettings={handleUpdateTenantSettings}
        setPage={setPage}
        setSelectedOAuth={setSelectedOAuth}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    :
      <AuthenticationFormPage
        handleSubmitOAuth={handleSubmitOAuth}
        handleUpdateOAuth={handleUpdateOAuth}
        isSubmitting={isSubmitting}
        submitError={submitError}
        selectedOAuth={oAuths.items.find(oAuth => oAuth.id === selectedOAuth)}
        page={page}
        setPage={setPage}
      />
  );
};

export default AuthenticationSiteSettingsP;