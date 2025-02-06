import * as React from 'react';
import I18n from 'i18n-js';

import PostBoardSelect from './PostBoardSelect';
import PostStatusSelect from './PostStatusSelect';

import IPostStatus from '../../interfaces/IPostStatus';
import IBoard from '../../interfaces/IBoard';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import ActionLink from '../common/ActionLink';
import { CancelIcon, DeleteIcon } from '../common/Icons';
import ITenantSetting from '../../interfaces/ITenantSetting';
import Dropzone from '../common/Dropzone';
import { DangerText } from '../common/CustomTexts';

interface Props {
  title: string;
  description?: string;
  boardId: number;
  postStatusId?: number;
  attachmentUrls?: string[];

  isUpdating: boolean;
  error: string;

  handleChangeTitle(title: string): void;
  handleChangeDescription(description: string): void;
  handleChangeBoard(boardId: number): void;
  handleChangePostStatus(postStatusId: number): void;

  tenantSetting: ITenantSetting;
  isPowerUser: boolean;
  boards: Array<IBoard>;
  postStatuses: Array<IPostStatus>;

  toggleEditMode(): void;
  handleUpdatePost(
    title: string,
    description: string,
    boardId: number,
    postStatusId: number,
    attachmentsToDelete: number[],
    attachments: File[],
  ): void;
}

const PostEditForm = ({
  title,
  description,
  boardId,
  postStatusId,
  attachmentUrls,

  isUpdating,
  error,

  handleChangeTitle,
  handleChangeDescription,
  handleChangeBoard,
  handleChangePostStatus,

  tenantSetting,
  isPowerUser,
  boards,
  postStatuses,

  toggleEditMode,
  handleUpdatePost,
}: Props) => {
  const [attachmentsToDelete, setAttachmentsToDelete] = React.useState<number[]>([]);
  const [attachments, setAttachments] = React.useState<File[]>([]);

  React.useEffect(() => {
    setAttachmentsToDelete([]);
  }, [attachmentUrls]);

  return (
    <div className="postEditForm">
      <div className="postHeader">
        <input
          type="text"
          value={title}
          onChange={e => handleChangeTitle(e.target.value)}
          autoFocus
          className="postTitle form-control"
        />
      </div>

      {
        isPowerUser ?
          <div className="postSettings">
            <PostBoardSelect
              boards={boards}
              selectedBoardId={boardId}
              handleChange={newBoardId => handleChangeBoard(newBoardId)}
            />
            <PostStatusSelect
              postStatuses={postStatuses}
              selectedPostStatusId={postStatusId}
              handleChange={newPostStatusId => handleChangePostStatus(newPostStatusId)}
            />
          </div>
        :
          null
      }

      <textarea
        value={description}
        onChange={e => handleChangeDescription(e.target.value)}
        rows={5}
        className="postDescription form-control"
      />

      { /* Attachments */ }
      <div className="thumbnailsContainer" style={{ display: attachmentUrls && attachmentUrls.length > 0 ? 'flex' : 'none' }}>
      {
        attachmentUrls && attachmentUrls.map((attachmentUrl, i) => (
          <div className="thumbnailContainer" key={i}>
            <div className={`thumbnail${attachmentsToDelete.includes(i) ? ' thumbnailToDelete' : ''}`}>
              <div className="thumbnailInner">
                <img
                  src={attachmentUrl}
                  className="thumbnailImage"
                />
              </div>
            </div>
            
            {
              attachmentsToDelete.includes(i) ?
                <ActionLink
                  onClick={() => setAttachmentsToDelete(attachmentsToDelete.filter(index => index !== i))}
                  icon={<CancelIcon />}
                  customClass="removeThumbnail"
                >
                  {I18n.t('common.buttons.cancel')}
                </ActionLink>
              :
                <ActionLink
                  onClick={() => setAttachmentsToDelete([...attachmentsToDelete, i])}
                  icon={<DeleteIcon />}
                  customClass="removeThumbnail"
                >
                  {I18n.t('common.buttons.delete')}
                </ActionLink>
            }
          </div>
        ))
      }
      </div>

      { /* Attachments dropzone */ }
      {
        tenantSetting.allow_attachment_upload &&
          <div className="form-group">
            <Dropzone
              files={attachments}
              setFiles={setAttachments}
              maxSizeKB={2048}
              maxFiles={5}
              customStyle={{ minHeight: '60px', marginTop: '16px' }}
            />
          </div>
      }

      <div className="postEditFormButtons">
        <ActionLink onClick={toggleEditMode} icon={<CancelIcon />}>
          {I18n.t('common.buttons.cancel')}
        </ActionLink>
        &nbsp;
        <Button onClick={() => handleUpdatePost(title, description, boardId, postStatusId, attachmentsToDelete, attachments)}>
          { isUpdating ? <Spinner /> : I18n.t('common.buttons.update') }
        </Button>
      </div>
      
      { error && <DangerText>{error}</DangerText> }
    </div>
  );
};

export default PostEditForm;