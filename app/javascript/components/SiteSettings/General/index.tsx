import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import GeneralSiteSettings from '../../../containers/GeneralSiteSettings';
import createStoreHelper from '../../../helpers/createStore';
import IBoardJSON from '../../../interfaces/json/IBoard';
import { State } from '../../../reducers/rootReducer';
import { ISiteSettingsGeneralForm } from './GeneralSiteSettingsP';

interface Props {
  originForm: ISiteSettingsGeneralForm;
  siteLogoUrl?: string;
  siteFaviconUrl?: string;
  boards: IBoardJSON[];
  isMultiTenant: boolean;
  authenticityToken: string;
}

class GeneralSiteSettingsRoot extends React.Component<Props> {
  store: Store<State, any>;

  constructor(props: Props) {
    super(props);

    this.store = createStoreHelper();
  }

  render() {
    return (
      <Provider store={this.store}>
        <GeneralSiteSettings
          originForm={this.props.originForm}
          siteLogoUrl={this.props.siteLogoUrl}
          siteFaviconUrl={this.props.siteFaviconUrl}
          boards={this.props.boards}
          isMultiTenant={this.props.isMultiTenant}
          authenticityToken={this.props.authenticityToken}
        />
      </Provider>
    );
  }
}

export default GeneralSiteSettingsRoot;