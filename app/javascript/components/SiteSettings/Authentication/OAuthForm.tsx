import * as React from 'react';
import I18n from 'i18n-js';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DangerText } from '../../common/CustomTexts';
import { getLabel, getValidationMessage } from '../../../helpers/formUtils';
import Button from '../../common/Button';
import { URL_REGEX } from '../../../constants/regex';
import { IOAuth } from '../../../interfaces/IOAuth';
import { AuthenticationPages } from './AuthenticationSiteSettingsP';
import { useState } from 'react';
import Separator from '../../common/Separator';
import ActionLink from '../../common/ActionLink';
import { BackIcon, CancelIcon, DeleteIcon, EditIcon } from '../../common/Icons';
import Dropzone from '../../common/Dropzone';

interface Props {
  selectedOAuth: IOAuth;
  page: AuthenticationPages;
  setPage: React.Dispatch<React.SetStateAction<AuthenticationPages>>;

  handleSubmitOAuth(oAuth: IOAuth, oAuthLogo: File): void;
  handleUpdateOAuth(id: number, form: ISiteSettingsOAuthForm, shouldDeleteLogo: boolean): void;
}

export interface ISiteSettingsOAuthForm {
  name: string;
  logo?: File;
  shouldDeleteLogo: boolean;
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  profileUrl: string;
  scope: string;
  jsonUserEmailPath: string;
  jsonUserNamePath: string;
}

const OAuthForm = ({
  selectedOAuth,
  page,
  setPage,

  handleSubmitOAuth,
  handleUpdateOAuth,
}: Props) => {
  const [editClientSecret, setEditClientSecret] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    watch,
  } = useForm<ISiteSettingsOAuthForm>({
    defaultValues: page === 'new' ? {
      name: '',
      logo: null,
      shouldDeleteLogo: false,
      clientId: '',
      clientSecret: '',
      authorizeUrl: '',
      tokenUrl: '',
      profileUrl: '',
      scope: '',
      jsonUserEmailPath: '',
      jsonUserNamePath: '',
    } : {
      name: selectedOAuth.name,
      logo: null,
      shouldDeleteLogo: false,
      clientId: selectedOAuth.clientId,
      clientSecret: selectedOAuth.clientSecret,
      authorizeUrl: selectedOAuth.authorizeUrl,
      tokenUrl: selectedOAuth.tokenUrl,
      profileUrl: selectedOAuth.profileUrl,
      scope: selectedOAuth.scope,
      jsonUserEmailPath: selectedOAuth.jsonUserEmailPath,
      jsonUserNamePath: selectedOAuth.jsonUserNamePath,
    },
  });

  const onSubmit: SubmitHandler<ISiteSettingsOAuthForm> = data => {
    const oAuth = { ...data, isEnabled: false };

    if (page === 'new') {
      handleSubmitOAuth(
        oAuth,
        data.logo ? data.logo : null
      );
    } else if (page === 'edit') {
      if (editClientSecret === false) {
        delete oAuth.clientSecret;
      }

      handleUpdateOAuth(
        selectedOAuth.id,
        oAuth as ISiteSettingsOAuthForm,
        data.shouldDeleteLogo
      );
    }
  };

  const shouldDeleteLogo = watch('shouldDeleteLogo');
  const [showOAuthLogoDropzone, setShowOAuthLogoDropzone] = React.useState([null, undefined, ''].includes(selectedOAuth?.logoUrl));

  return (
    <>
    <ActionLink
      onClick={() => {
        let confirmation = true;
        if (isDirty)
          confirmation = confirm(I18n.t('common.unsaved_changes') + ' ' + I18n.t('common.confirmation'));
        if (confirmation) setPage('index');
      }}
      icon={<BackIcon />}
      customClass="backButton"
    >
      {I18n.t('common.buttons.back')}
    </ActionLink>
    
    <h2>{ I18n.t(`site_settings.authentication.form.title_${page}`) }</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="formRow">
        <div className="formGroup col-6">
          <label htmlFor="name">{ getLabel('o_auth', 'name') }</label>
          <input
            {...register('name', { required: true })}
            id="name"
            className="formControl"
          />
          <DangerText>{errors.name && getValidationMessage(errors.name.type, 'o_auth', 'name')}</DangerText>
        </div>

        <div className="formGroup col-6">
          <label htmlFor="logo">{ getLabel('o_auth', 'logo') }</label>
          
          {
            selectedOAuth && selectedOAuth.logoUrl &&
              <div className={`oAuthLogoPreview${shouldDeleteLogo ? ' oAuthLogoPreviewShouldDelete' : ''}`}>
                <img src={selectedOAuth.logoUrl} alt={`${selectedOAuth.name} OAuth logo`} className="oAuthLogoPreviewImg" />
              </div>
          }

          <div className="oAuthLogoActions">
          {
            (selectedOAuth && selectedOAuth.logoUrl && !shouldDeleteLogo) &&
              (showOAuthLogoDropzone ?
                <ActionLink
                  onClick={() => setShowOAuthLogoDropzone(false)}
                  icon={<CancelIcon />}
                >
                  {I18n.t('common.buttons.cancel')}
                </ActionLink>
              :
                <ActionLink
                  onClick={() => setShowOAuthLogoDropzone(true)}
                  icon={<EditIcon />}
                >
                  {I18n.t('common.buttons.edit')}
                </ActionLink>)
          }

          {
            (selectedOAuth && selectedOAuth.logoUrl && !showOAuthLogoDropzone) &&
              (shouldDeleteLogo ?
                <Controller
                  name="shouldDeleteLogo"
                  control={control}
                  render={({ field }) => (
                    <ActionLink
                      onClick={() => field.onChange(false)}
                      icon={<CancelIcon />}
                    >
                      {I18n.t('common.buttons.cancel')}
                    </ActionLink>
                  )}
                />
                :
                <Controller
                  name="shouldDeleteLogo"
                  control={control}
                  render={({ field }) => (
                    <ActionLink
                      onClick={() => field.onChange(true)}
                      icon={<DeleteIcon />}
                    >
                      {I18n.t('common.buttons.delete')}
                    </ActionLink>
                  )}
                />
              )
          }
          </div>
          
          {
            showOAuthLogoDropzone &&
              <Controller
                name="logo"
                control={control}
                render={({ field }) => (
                  <Dropzone
                    files={field.value ? [field.value] : []}
                    setFiles={files => files.length > 0 ? field.onChange(files[0]) : field.onChange(null)}
                    maxSizeKB={64}
                    maxFiles={1}
                  />
                )}
              />
          }
          </div>
      </div>

      <h5>{ I18n.t('site_settings.authentication.form.subtitle_oauth_config') }</h5>
      <div className="formRow">
        <div className="formGroup col-6">
          <label htmlFor="clientId">{ getLabel('o_auth', 'client_id') }</label>
          <input
            {...register('clientId', { required: true })}
            id="clientId"
            className="formControl"
          />
          <DangerText>{errors.clientId && getValidationMessage(errors.clientId.type, 'o_auth', 'client_id')}</DangerText>
        </div>

        <div className="formGroup col-6">
          <label htmlFor="clientSecret">{ getLabel('o_auth', 'client_secret') }</label>
          <input
            {...register('clientSecret', { required: page === 'new' || (page === 'edit' && editClientSecret) })}
            id="clientSecret"
            className="formControl"
            disabled={page === 'edit' && editClientSecret === false}
          />
          {
            page === 'edit' &&
              <>
                <small>
                  {I18n.t('site_settings.authentication.form.client_secret_help') + "\t"}
                </small>
                <Separator />
                {
                  editClientSecret ?
                    <a onClick={() => setEditClientSecret(false)} className="link">{I18n.t('common.buttons.cancel')}</a>
                  :
                    <a onClick={() => setEditClientSecret(true)} className="link">{I18n.t('common.buttons.edit')}</a>
                }
                <br />
              </>
              
          }
          <DangerText>{errors.clientSecret && getValidationMessage(errors.clientSecret.type, 'o_auth', 'client_secret')}</DangerText>
        </div>
      </div>

      <div className="formRow">
        <div className="formGroup col-6">
          <label htmlFor="authorizeUrl">{ getLabel('o_auth', 'authorize_url') }</label>
          <input
            {...register('authorizeUrl', { required: true, pattern: URL_REGEX })}
            id="authorizeUrl"
            className="formControl"
          />
          <DangerText>{errors.authorizeUrl?.type === 'required' && getValidationMessage(errors.authorizeUrl.type, 'o_auth', 'authorize_url')}</DangerText>
          <DangerText>{errors.authorizeUrl?.type === 'pattern' && I18n.t('common.validations.url')}</DangerText>
        </div>

        <div className="formGroup col-6">
          <label htmlFor="tokenUrl">{ getLabel('o_auth', 'token_url') }</label>
          <input
            {...register('tokenUrl', { required: true, pattern: URL_REGEX })}
            id="tokenUrl"
            className="formControl"
          />
          <DangerText>{errors.tokenUrl?.type === 'required' && getValidationMessage(errors.tokenUrl.type, 'o_auth', 'token_url')}</DangerText>
          <DangerText>{errors.tokenUrl?.type === 'pattern' && I18n.t('common.validations.url')}</DangerText>
        </div>
      </div>

      <div className="formGroup">
        <label htmlFor="scope">{ getLabel('o_auth', 'scope') }</label>
        <input
          {...register('scope', { required: true })}
          id="scope"
          className="formControl"
        />
        <DangerText>{errors.scope && getValidationMessage(errors.scope.type, 'o_auth', 'scope')}</DangerText>
      </div>

      <h5>{ I18n.t('site_settings.authentication.form.subtitle_user_profile_config') }</h5>
      <div className="formGroup">
        <label htmlFor="profileUrl">{ getLabel('o_auth', 'profile_url') }</label>
        <input
          {...register('profileUrl', { required: true, pattern: URL_REGEX })}
          id="profileUrl"
          className="formControl"
        />
        <DangerText>{errors.profileUrl?.type === 'required' && getValidationMessage(errors.profileUrl.type, 'o_auth', 'profile_url')}</DangerText>
        <DangerText>{errors.profileUrl?.type === 'pattern' && I18n.t('common.validations.url')}</DangerText>
      </div>

      <div className="formRow">
        <div className="formGroup col-6">
          <label htmlFor="jsonUserEmailPath">{ getLabel('o_auth', 'json_user_email_path') }</label>
          <input
            {...register('jsonUserEmailPath', { required: true })}
            id="jsonUserEmailPath"
            className="formControl"
          />
          <DangerText>
            {errors.jsonUserEmailPath && getValidationMessage(errors.jsonUserEmailPath.type, 'o_auth', 'json_user_email_path')}
          </DangerText>
        </div>

        <div className="formGroup col-6">
          <label htmlFor="jsonUserNamePath">{ getLabel('o_auth', 'json_user_name_path') }</label>
          <input
            {...register('jsonUserNamePath')}
            id="jsonUserNamePath"
            className="formControl"
          />
        </div>
      </div>

      <Button onClick={() => null}>
        {
          page === 'new' ?
            I18n.t('common.buttons.create')
          :
            I18n.t('common.buttons.update')
        }
      </Button>
    </form>
    </>
  );
}

export default OAuthForm;