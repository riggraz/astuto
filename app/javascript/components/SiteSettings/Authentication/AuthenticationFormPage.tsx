import * as React from 'react';

import Box from '../../common/Box';
import { AuthenticationPages } from './AuthenticationSiteSettingsP';
import OAuthForm, { ISiteSettingsOAuthForm } from './OAuthForm';
import Spinner from '../../common/Spinner';
import { DangerText } from '../../common/CustomTexts';
import { IOAuth } from '../../../interfaces/IOAuth';

interface Props {
  handleSubmitOAuth(oAuth: IOAuth, oAuthLogo: File): void;
  handleUpdateOAuth(id: number, form: ISiteSettingsOAuthForm, shouldDeleteLogo: boolean): void;
  isSubmitting: boolean;
  submitError: string;
  selectedOAuth: IOAuth;
  page: AuthenticationPages;
  setPage: React.Dispatch<React.SetStateAction<AuthenticationPages>>;
}

const AuthenticationFormPage = ({
  handleSubmitOAuth,
  handleUpdateOAuth,
  isSubmitting,
  submitError,
  selectedOAuth,
  page,
  setPage,
}: Props) => (
  <>
    <Box customClass="authenticationFormPage">
      <OAuthForm
        handleSubmitOAuth={handleSubmitOAuth}
        handleUpdateOAuth={handleUpdateOAuth}
        selectedOAuth={selectedOAuth}
        page={page}
        setPage={setPage}
      />

      { isSubmitting && <Spinner /> }
      { submitError && <DangerText>{submitError}</DangerText> }
    </Box>
  </>
);

export default AuthenticationFormPage;