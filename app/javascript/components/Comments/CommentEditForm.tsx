import * as React from 'react';
import I18n from 'i18n-js';
import Button from '../common/Button';
import Switch from '../common/Switch';
import ActionLink from '../common/ActionLink';
import { CancelIcon, DeleteIcon, MarkdownIcon } from '../common/Icons';
import Dropzone from '../common/Dropzone';
import ITenantSetting from '../../interfaces/ITenantSetting';

interface Props {
  id: number;
  initialBody: string;
  initialIsPostUpdate: boolean;
  attachmentUrls?: string[];

  isPowerUser: boolean;
  tenantSetting: ITenantSetting;

  handleUpdateComment(body: string, isPostUpdate: boolean, attachmentsToDelete: number[], attachments: File[]): void;
  toggleEditMode(): void;
}

interface State {
  body: string;
  isPostUpdate: boolean;
  attachmentsToDelete: number[];
  attachments: File[];
}

class CommentEditForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
      isPostUpdate: false,
      attachmentsToDelete: [],
      attachments: [],
    };

    this.handleCommentBodyChange = this.handleCommentBodyChange.bind(this);
    this.handleCommentIsPostUpdateChange = this.handleCommentIsPostUpdateChange.bind(this);
    this.handleAttachmentsToDeleteChange = this.handleAttachmentsToDeleteChange.bind(this);
    this.handleAttachmentsChange = this.handleAttachmentsChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      body: this.props.initialBody,
      isPostUpdate: this.props.initialIsPostUpdate,
    });
  }

  handleCommentBodyChange(newCommentBody: string) {
    this.setState({ body: newCommentBody });
  }

  handleCommentIsPostUpdateChange(newIsPostUpdate: boolean) {
    this.setState({ isPostUpdate: newIsPostUpdate });
  }

  handleAttachmentsToDeleteChange(newAttachmentsToDelete: number[]) {
    this.setState({ attachmentsToDelete: newAttachmentsToDelete });
  }

  handleAttachmentsChange(newAttachments: File[]) {
    this.setState({ attachments: newAttachments });
  }

  render() {
    const { id, attachmentUrls, isPowerUser, tenantSetting, handleUpdateComment, toggleEditMode } = this.props;
    const { body, isPostUpdate, attachmentsToDelete, attachments } = this.state;

    return (
      <div className="editCommentForm">
        
        <div className="commentFormContainer">
          <textarea
            value={body}
            onChange={e => this.handleCommentBodyChange(e.target.value)}
            rows={3}
            autoFocus
            className="commentForm"
          />
          <div style={{position: 'relative', width: 0, height: 0}}>
            <MarkdownIcon style={{position: 'absolute', left: '6px', top: '-36px'}} />
          </div>
        </div>

        <div className="editCommentFormAttachments">
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
                      onClick={() => this.handleAttachmentsToDeleteChange(attachmentsToDelete.filter(index => index !== i))}
                      icon={<CancelIcon />}
                      customClass="removeThumbnail"
                    >
                      {I18n.t('common.buttons.cancel')}
                    </ActionLink>
                  :
                    <ActionLink
                      onClick={() => this.handleAttachmentsToDeleteChange([...attachmentsToDelete, i])}
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
                  setFiles={this.handleAttachmentsChange}
                  maxSizeKB={2048}
                  maxFiles={5}
                  customStyle={{ minHeight: '60px', marginTop: '16px' }}
                />
              </div>
          }

          <div className="editCommentFormFooter">
            { /* Is post update */ }
            <div className="editCommentFormPostUpdate">
              {
                isPowerUser &&
                  <Switch
                    htmlId={`isPostUpdateFlagComment${id}`}
                    onClick={e => this.handleCommentIsPostUpdateChange(!isPostUpdate)}
                    checked={isPostUpdate || false}
                    label={I18n.t('post.new_comment.is_post_update')}
                  />
              }
            </div>

            <div className="editCommentFormActions">
              <ActionLink onClick={toggleEditMode} icon={<CancelIcon />}>
                {I18n.t('common.buttons.cancel')}
              </ActionLink>
              &nbsp;
              <Button onClick={() => handleUpdateComment(body, isPostUpdate, attachmentsToDelete, attachments)}>
                {I18n.t('common.buttons.update')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CommentEditForm;