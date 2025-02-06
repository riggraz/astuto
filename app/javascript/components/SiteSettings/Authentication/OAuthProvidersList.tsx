import * as React from 'react';
import I18n from 'i18n-js';

import { AuthenticationPages } from './AuthenticationSiteSettingsP';
import Button from '../../common/Button';
import { IOAuth } from '../../../interfaces/IOAuth';
import OAuthProviderItem from './OAuthProviderItem';
import ActionLink from '../../common/ActionLink';
import { LearnMoreIcon } from '../../common/Icons';

interface Props {
  oAuths: Array<IOAuth>;
  handleToggleEnabledOAuth(id: number, enabled: boolean): void;
  handleToggleEnabledDefaultOAuth(id: number, enabled: boolean): void;
  handleDeleteOAuth(id: number): void;
  setPage: React.Dispatch<React.SetStateAction<AuthenticationPages>>;
  setSelectedOAuth: React.Dispatch<React.SetStateAction<number>>;
}

const OAuthProvidersList = ({
  oAuths,
  handleToggleEnabledOAuth,
  handleToggleEnabledDefaultOAuth,
  handleDeleteOAuth,
  setPage,
  setSelectedOAuth,
}: Props) => (
  <>
    <div className="oauthProvidersTitle">
      <h4>{ I18n.t('site_settings.authentication.oauth_subtitle') }</h4>
      <Button onClick={() => { setSelectedOAuth(null); setPage('new'); }}>
        { I18n.t('common.buttons.new') }
      </Button>
    </div>

    <p style={{textAlign: 'left'}}>
      <ActionLink
        onClick={() => window.open('https://docs.astuto.io/category/oauth-configuration/', '_blank')}
        icon={<LearnMoreIcon />}
      >
        {I18n.t('site_settings.authentication.learn_more')}
      </ActionLink>
    </p>

    <ul className="oAuthsList">
      {
        oAuths.map((oAuth, i) => (
          <OAuthProviderItem
            oAuth={oAuth}
            handleToggleEnabledOAuth={handleToggleEnabledOAuth}
            handleToggleEnabledDefaultOAuth={handleToggleEnabledDefaultOAuth}
            handleDeleteOAuth={handleDeleteOAuth}
            setPage={setPage}
            setSelectedOAuth={setSelectedOAuth}
            key={i}
          />
        ))
      }
    </ul>
  </>
);

export default OAuthProvidersList;