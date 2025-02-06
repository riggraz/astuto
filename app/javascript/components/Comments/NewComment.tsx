import * as React from 'react';
import I18n from 'i18n-js';

import NewCommentUpdateSection from './NewCommentUpdateSection';

import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { DangerText } from '../common/CustomTexts';
import { AttachIcon, CancelIcon, MarkdownIcon } from '../common/Icons';
import Avatar from '../common/Avatar';
import ActionLink from '../common/ActionLink';
import Dropzone from '../common/Dropzone';

interface Props {
  body: string;
  parentId: number;
  postUpdateFlagValue: boolean;
  isSubmitting: boolean;
  error: string;
  handleChange(e: React.FormEvent): void;
  handlePostUpdateFlag(): void;
  handleSubmit(
    body: string,
    parentId: number,
    isPostUpdate: boolean,
    attachments: File[],
    onSuccess: Function,
  ): void;

  allowAttachmentUpload: boolean;
  isLoggedIn: boolean;
  isPowerUser: boolean;
  userEmail: string;
  userAvatar?: string;
}

const NewComment = ({
  body,
  parentId,
  postUpdateFlagValue,
  isSubmitting,
  error,
  handleChange,
  handlePostUpdateFlag,
  handleSubmit,

  allowAttachmentUpload,
  isLoggedIn,
  isPowerUser,
  userEmail,
  userAvatar,
}: Props) => {

  const [isAttachingFiles, setIsAttachingFiles] = React.useState(false);
  const [attachments, setAttachments] = React.useState<File[]>([]);

  return (
    <>
      <div className="newCommentForm">
        {
          isLoggedIn ?
            <>
              <div className="newCommentBodyForm">
                <Avatar avatarUrl={userAvatar} email={userEmail} size={48} customClass="currentUserAvatar" />
                
                <div style={{width: '100%', marginRight: '8px'}}>
                  <textarea
                    value={body}
                    onChange={handleChange}
                    autoFocus={parentId != null}
                    placeholder={I18n.t('post.new_comment.body_placeholder')}
                    className="commentForm"
                  />
                  <div style={{position: 'relative', width: 0, height: 0}}>
                    <MarkdownIcon style={{position: 'absolute', left: '6px', top: '-28px'}} />
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    handleSubmit(
                      body,
                      parentId,
                      postUpdateFlagValue,
                      attachments,
                      () => { setIsAttachingFiles(false); setAttachments([]); }
                    );
                  }}
                  className="submitCommentButton">
                  { isSubmitting ? <Spinner color="light" /> : I18n.t('post.new_comment.submit_button') }
                </Button>
              </div>
              <div className="newCommentFooter">
                { /* Attach files */ }
                <div className={`attachFilesSection${allowAttachmentUpload ? '' : ' attachFilesSectionHidden'}`}>
                {
                  isAttachingFiles ?
                    <ActionLink
                      icon={<CancelIcon />}
                      onClick={() => { setIsAttachingFiles(false); setAttachments([]); }}
                      customClass='cancelAttachFilesNewComment'
                    >
                      {I18n.t('common.buttons.cancel')}
                    </ActionLink>
                  :
                    <ActionLink
                      icon={<AttachIcon />}
                      onClick={() => setIsAttachingFiles(true)}
                      customClass='showAttachFilesNewComment'
                    >
                      {I18n.t('common.buttons.attach')}
                    </ActionLink>
                }
                {
                  isAttachingFiles &&
                    <Dropzone
                      files={attachments}
                      setFiles={setAttachments}
                      maxSizeKB={2048}
                      maxFiles={5}
                      customStyle={{ minHeight: '60px', marginTop: '16px' }}
                    />
                }
                </div>

                { /* Post update flag */ }
                {
                  isPowerUser && parentId == null &&
                    <NewCommentUpdateSection
                      postUpdateFlagValue={postUpdateFlagValue}
                      handlePostUpdateFlag={handlePostUpdateFlag}
                      allowAttachmentUpload={allowAttachmentUpload}
                    />
                }
              </div>
            </>
          :
            <a href="/users/sign_in" className="loginInfo">
              {I18n.t('post.new_comment.not_logged_in')}
            </a>
        }
      </div>

      { error ? <DangerText>{error}</DangerText> : null }
    </>
  );
};

export default NewComment;