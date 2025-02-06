import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import I18n from 'i18n-js';

import { DangerText, CenteredMutedText } from '../common/CustomTexts';
import Spinner from '../common/Spinner';

import IComment from '../../interfaces/IComment';
import IPostStatusChange from '../../interfaces/IPostStatusChange';
import IPostStatus from '../../interfaces/IPostStatus';

import friendlyDate from '../../helpers/datetime';
import PostStatusLabel from '../common/PostStatusLabel';
import SidebarBox from '../common/SidebarBox';
import Avatar from '../common/Avatar';

interface Props {
  postUpdates: Array<IComment | IPostStatusChange>;
  postStatuses: Array<IPostStatus>
  areLoading: boolean;
  error: string;
}

const PostUpdateList = ({
  postUpdates,
  postStatuses,
  areLoading,
  error,
}: Props) => (
  <SidebarBox title={I18n.t('post.updates_box.title')} customClass="postUpdateListContainer">
    { areLoading ? <Spinner /> : null }
    { error ? <DangerText>{error}</DangerText> : null }

    <div className="postUpdateList">
      {
        postUpdates.length === 0 && !areLoading && !error ?
          <CenteredMutedText>{I18n.t('post.updates_box.empty')}</CenteredMutedText>
        :
          null
      }
      {
        postUpdates.map((postUpdate, i) => (
          <div className="postUpdateListItem" key={i}>
            <div className="postUpdateListItemHeader">
              <Avatar avatarUrl={postUpdate.userAvatar} email={postUpdate.userEmail} size={28} />
              
              <span>{postUpdate.userFullName}</span>
            </div>

            <div className="postUpdateListItemBody">
              { 'body' in postUpdate ?
                  <ReactMarkdown
                    className="postUpdateBody"
                    disallowedTypes={['heading', 'image', 'html']}
                    unwrapDisallowed
                  >
                    {postUpdate.body}
                  </ReactMarkdown>
                :
                  <>
                    <i>{I18n.t('post.updates_box.status_change')}</i>&nbsp;
                    <PostStatusLabel
                      {...postStatuses.find(postStatus => postStatus.id === postUpdate.postStatusId)}
                    />
                  </>  
              }
            </div>

            <span className="mutedText" title={postUpdate.createdAt}>
              {friendlyDate(postUpdate.createdAt)}
            </span>
          </div>
        ))
      }
    </div>
  </SidebarBox>
);

export default PostUpdateList;