import * as React from 'react';
import I18n from 'i18n-js';

import ILike from '../../interfaces/ILike';
import Spinner from '../common/Spinner';
import SidebarBox from '../common/SidebarBox';
import {
  DangerText,
  CenteredMutedText
} from '../common/CustomTexts';
import Avatar from '../common/Avatar';

interface Props {
  likes: Array<ILike>;
  areLoading: boolean;
  error: string;
}

const LikeList = ({ likes, areLoading, error}: Props) => (
  <SidebarBox title={I18n.t('post.likes_box.title')} customClass="likeListContainer">
    { areLoading ? <Spinner /> : null }
    { error ? <DangerText>{error}</DangerText> : null }

    <div className="likeList">
      { likes.length === 0 ? <CenteredMutedText>{I18n.t('post.likes_box.empty')}</CenteredMutedText> : null }
      {
        likes.map((like, i) => (
          <div className="likeListItem" key={i}>
            <Avatar avatarUrl={like.userAvatar} email={like.email} size={32} />
            
            <div className="likeListItemUserInfo">
              <span className="likeListItemName" title={like.fullName}>{like.fullName}</span>
              <span className="likeListItemEmail" title={like.email}>{like.email}</span>
            </div>
          </div>
        ))
      }
    </div>
  </SidebarBox>
);

export default LikeList;