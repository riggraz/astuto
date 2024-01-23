import * as React from 'react';
import { useState } from 'react';
import I18n from 'i18n-js';

import Box from '../../common/Box';
import SiteSettingsInfoBox from '../../common/SiteSettingsInfoBox';
import Button from '../../common/Button';
import HttpStatus from '../../../constants/http_status';
import { getLabel } from '../../../helpers/formUtils';
import { SubmitHandler, useForm } from 'react-hook-form';


export interface ISiteSettingsAppearanceForm {
  customCss: string;
}

interface Props {
  originForm: ISiteSettingsAppearanceForm;
  authenticityToken: string;

  areUpdating: boolean;
  error: string;

  updateTenant(
    customCss: string,
    authenticityToken: string
  ): Promise<any>;
}

const AppearanceSiteSettingsP = ({
  originForm,
  authenticityToken,

  areUpdating,
  error,
  updateTenant,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitSuccessful, errors }
  } = useForm<ISiteSettingsAppearanceForm>({
    defaultValues: {
      customCss: originForm.customCss,
    },
  });
  
  const onSubmit: SubmitHandler<ISiteSettingsAppearanceForm> = data => {
    updateTenant(
      data.customCss,
      authenticityToken
    ).then(res => {
      if (res?.status !== HttpStatus.OK) return;
      window.location.reload();
    });
  };

  return (
    <>
      <Box>
        <h2>{ I18n.t('site_settings.appearance.title') }</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formRow">
            <div className="formGroup customCssForm col-12">
              <h4>{ getLabel('tenant_setting', 'custom_css') }</h4>

              <textarea
                {...register('customCss')}
                maxLength={32000}
                id="customCss"
                className="formControl"
              />
            </div>
          </div>

          <Button onClick={() => null} disabled={!isDirty}>
            {I18n.t('common.buttons.update')}
          </Button>
        </form>
      </Box>

      <SiteSettingsInfoBox
        areUpdating={areUpdating}
        error={error}
        areDirty={isDirty && !isSubmitSuccessful}
      />
    </>
  );
}

export default AppearanceSiteSettingsP;
