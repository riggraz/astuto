import * as React from 'react';
import I18n from 'i18n-js';

import Button from '../common/Button';
import { SmallMutedText } from '../common/CustomTexts';
import { MarkdownIcon } from '../common/Icons';
import Dropzone from '../common/Dropzone';
import ITenantSetting from '../../interfaces/ITenantSetting';

interface Props {
  title: string;
  description: string;
  attachments: File[];
  handleTitleChange(title: string): void;
  handleDescriptionChange(description: string): void;
  handleAttachmentsChange(attachments: File[]): void;

  handleSubmit(e: object): void;

  dnf1: string;
  dnf2: string;
  handleDnf1Change(dnf1: string): void;
  handleDnf2Change(dnf2: string): void;

  tenantSetting: ITenantSetting;
  currentUserFullName: string;
  isSubmissionAnonymous: boolean;
}

const NewPostForm = ({
  title,
  description,
  attachments,
  handleTitleChange,
  handleDescriptionChange,
  handleAttachmentsChange,

  handleSubmit,

  dnf1,
  dnf2,
  handleDnf1Change,
  handleDnf2Change,

  tenantSetting,
  currentUserFullName,
  isSubmissionAnonymous,
  }: Props) => (
  <div className="newPostForm">
    <form encType="multipart/form-data">

      { /* Title */ }
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          maxLength={128}
          placeholder={I18n.t('board.new_post.title')}

          id="postTitle"
          className="form-control"
          
          autoFocus
        />
      </div>

      { /* Honeypot field 1 */ }
      <div className="form-group form-group-dnf">
        <input
          type="text"
          value={dnf1}
          onChange={e => handleDnf1Change(e.target.value)}
          maxLength={128}
          placeholder="email"
          autoComplete="off"

          id="email"
          className="form-control"
        />
      </div>

      { /* Honeypot field 2 */ }
      <input
        type="text"
        value={dnf2}
        onChange={e => handleDnf2Change(e.target.value)}
        maxLength={128}
        placeholder="name"
        autoComplete="off"
        tabIndex={-1}

        id="name"
        className="form-control"
      />

      { /* Description */ }
      <div className="form-group">
        <textarea
          value={description}
          onChange={e => handleDescriptionChange(e.target.value)}
          rows={3}
          placeholder={I18n.t('board.new_post.description')}

          className="form-control"
          id="postDescription"
        ></textarea>
        <div style={{position: 'relative', width: 0, height: 0}}>
          <MarkdownIcon style={{position: 'absolute', left: '6px', top: '-28px'}} />
        </div>
      </div>

      { /* Attachments */ }
      {
        tenantSetting.allow_attachment_upload && !isSubmissionAnonymous &&
          <div className="form-group">
            <Dropzone
              files={attachments}
              setFiles={handleAttachmentsChange}
              maxSizeKB={2048}
              maxFiles={5}
            />
          </div>
      }

      <Button onClick={e => handleSubmit(e)} className="submitBtn d-block mx-auto">
        {I18n.t('board.new_post.submit_button')}
      </Button>

      <SmallMutedText>
        {
          isSubmissionAnonymous ?
            I18n.t('board.new_post.anonymous_submission_help')
          :
            I18n.t('board.new_post.non_anonymous_submission_help', { name: currentUserFullName })
        }
      </SmallMutedText>
    </form>
  </div>
);

export default NewPostForm;