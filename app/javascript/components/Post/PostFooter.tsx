import * as React from 'react';
import I18n from 'i18n-js';

import friendlyDate from '../../helpers/datetime';
import Separator from '../common/Separator';
import ActionLink from '../common/ActionLink';
import { DeleteIcon, EditIcon } from '../common/Icons';
import Avatar from '../common/Avatar';

interface Props {
  createdAt: string;
  toggleEditMode(): void;
  handleDeletePost(): void;
  isPowerUser: boolean;
  authorEmail: string;
  authorFullName: string;
  authorAvatar?: string;
  currentUserEmail: string;
}

const PostFooter = ({
  createdAt,
  toggleEditMode,
  handleDeletePost,
  isPowerUser,
  authorEmail,
  authorFullName,
  authorAvatar,
  currentUserEmail,
}: Props) => (
  <div className="postFooter">
    <div className="postAuthor">
      {
        authorEmail ?
          <>
          <span>{I18n.t('post.published_by').toLowerCase()} &nbsp;</span>
          <Avatar avatarUrl={authorAvatar} email={authorEmail} size={24} customClass="postAuthorAvatar" /> &nbsp;
          <span>{authorFullName}</span>
          </>
        :
          <span>{I18n.t('post.published_anonymously').toLowerCase()}</span>
      }
      
      <Separator />

      <span title={createdAt}>
        {friendlyDate(createdAt)}
      </span>
    </div>
    {
      isPowerUser || (authorEmail && authorEmail === currentUserEmail) ?
        <div className="postFooterActions">
          <ActionLink onClick={toggleEditMode} icon={<EditIcon />} customClass='editAction'>
            {I18n.t('common.buttons.edit')}
          </ActionLink>
          
          <ActionLink
            onClick={() => confirm(I18n.t('common.confirmation')) && handleDeletePost()}
            icon={<DeleteIcon />}
            customClass='deleteAction'
          >
            {I18n.t('common.buttons.delete')}
          </ActionLink>
        </div>
      :
        null
    }
  </div>
);

export default PostFooter;