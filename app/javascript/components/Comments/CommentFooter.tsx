import * as React from 'react';
import I18n from 'i18n-js';

import Separator from '../common/Separator';
import { MutedText } from '../common/CustomTexts';
import friendlyDate, { fromRailsStringToJavascriptDate } from '../../helpers/datetime';
import { ReplyFormState } from '../../reducers/replyFormReducer';
import ActionLink from '../common/ActionLink';
import { CancelIcon, DeleteIcon, EditIcon, ReplyIcon } from '../common/Icons';

interface Props {
  id: number;
  createdAt: string;
  updatedAt: string;
  replyForm: ReplyFormState;
  isPowerUser: boolean;
  currentUserEmail: string;
  commentAuthorEmail: string;

  handleDeleteComment(id: number): void;
  handleToggleCommentReply(): void;
  toggleEditMode(): void;
}

const CommentFooter = ({
  id,
  createdAt,
  updatedAt,
  replyForm,
  isPowerUser,
  currentUserEmail,
  commentAuthorEmail,
  
  handleDeleteComment,
  handleToggleCommentReply,
  toggleEditMode,
}: Props) => (
  <div className="commentFooter">
    <ActionLink
      onClick={handleToggleCommentReply}
      icon={replyForm.isOpen ? <CancelIcon /> : <ReplyIcon />}
      customClass={replyForm.isOpen ? 'cancelAction' : 'replyAction'}
    >
      {
        replyForm.isOpen ?
          I18n.t('common.buttons.cancel')
        :
          I18n.t('post.comments.reply_button')
      }
    </ActionLink>
    {
      isPowerUser || currentUserEmail === commentAuthorEmail ?
        <>
          <ActionLink onClick={toggleEditMode} icon={<EditIcon />}>
            {I18n.t('common.buttons.edit')}
          </ActionLink>

          <ActionLink
            onClick={() => confirm(I18n.t('common.confirmation')) && handleDeleteComment(id)}
            icon={<DeleteIcon />}
          >
            {I18n.t('common.buttons.delete')}
          </ActionLink>
        </>
      :
        null
    }
    
    <span className="mutedText" title={createdAt}>
      {friendlyDate(createdAt)}
    </span>

    {
      fromRailsStringToJavascriptDate(updatedAt).getTime() - fromRailsStringToJavascriptDate(createdAt).getTime() > 10000 &&
        <>
          <Separator />
          <MutedText>{ I18n.t('common.edited').toLowerCase() }</MutedText>
        </>
    }
  </div>
);

export default CommentFooter;