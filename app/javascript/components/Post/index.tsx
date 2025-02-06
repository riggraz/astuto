import * as React from 'react';
import { Provider } from 'react-redux';

import createStoreHelper from '../../helpers/createStore';

import Post from '../../containers/Post';

import IBoard from '../../interfaces/IBoard';
import IPostStatus from '../../interfaces/IPostStatus';

import { Store } from 'redux';
import { State } from '../../reducers/rootReducer';
import ITenantSetting from '../../interfaces/ITenantSetting';

interface Props {
  postId: number;
  boards: Array<IBoard>;
  postStatuses: Array<IPostStatus>;
  originPost: any;
  isLoggedIn: boolean;
  isPowerUser: boolean;
  currentUserFullName: string;
  currentUserEmail: string;
  currentUserAvatar?: string;
  tenantSetting: ITenantSetting;
  authenticityToken: string;
}

class PostRoot extends React.Component<Props> {
  store: Store<State, any>;

  constructor(props: Props) {
    super(props);

    this.store = createStoreHelper();
  }

  render() {
    const {
      postId,
      boards,
      postStatuses,
      originPost,
      isLoggedIn,
      isPowerUser,
      currentUserFullName,
      currentUserEmail,
      currentUserAvatar,
      tenantSetting,
      authenticityToken
    } = this.props;

    return (
      <Provider store={this.store}>
        <Post
          postId={postId}
          boards={boards}
          postStatuses={postStatuses}
          originPost={originPost}

          isLoggedIn={isLoggedIn}
          isPowerUser={isPowerUser}
          currentUserFullName={currentUserFullName}
          currentUserEmail={currentUserEmail}
          currentUserAvatar={currentUserAvatar}
          tenantSetting={tenantSetting}
          authenticityToken={authenticityToken}
        />
      </Provider>
    );
  }
}

export default PostRoot;