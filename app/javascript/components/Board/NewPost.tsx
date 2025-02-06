import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import I18n from 'i18n-js';

import NewPostForm from './NewPostForm';
import Spinner from '../common/Spinner';
import {
  DangerText,
  SuccessText,
} from '../common/CustomTexts';
import Button from '../common/Button';

import IBoard from '../../interfaces/IBoard';
import HttpStatus from '../../constants/http_status';
import { POST_APPROVAL_STATUS_APPROVED } from '../../interfaces/IPost';
import ActionLink from '../common/ActionLink';
import { CancelIcon } from '../common/Icons';
import buildFormData from '../../helpers/buildFormData';
import ITenantSetting from '../../interfaces/ITenantSetting';

interface Props {
  board: IBoard;
  tenantSetting: ITenantSetting;
  isLoggedIn: boolean;
  currentUserFullName: string;
  isAnonymousFeedbackAllowed: boolean;
  authenticityToken: string;

  // Time check anti-spam measure
  componentRenderedAt: number;
}

interface State {
  showForm: boolean;
  error: string;
  success: string;
  isLoading: boolean;

  title: string;
  description: string;
  attachments: File[];
  isSubmissionAnonymous: boolean;

  // Honeypot anti-spam measure
  // These fields are honeypots: they are not visibile and must not be filled
  // dnf = do not fill
  dnf1: string;
  dnf2: string;
}

class NewPost extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showForm: false,
      error: '',
      success: '',
      isLoading: false,

      title: '',
      description: '',
      attachments: [],
      isSubmissionAnonymous: false,

      dnf1: '',
      dnf2: '',
    };

    this.toggleForm = this.toggleForm.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onAttachmentsChange = this.onAttachmentsChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

    this.onDnf1Change = this.onDnf1Change.bind(this)
    this.onDnf2Change = this.onDnf2Change.bind(this)
  }

  toggleForm() {
    this.setState({
      showForm: !this.state.showForm,
      error: '',
      success: '',
      isLoading: false,
    });
  }

  onTitleChange(title: string) {
    this.setState({
      title,
      error: '',
    });
  }

  onDescriptionChange(description: string) {
    this.setState({
      description,
    });
  }

  onAttachmentsChange(attachments: File[]) {
    this.setState({
      attachments,
    });
  }

  onDnf1Change(dnf1: string) {
    this.setState({
      dnf1,
    });
  }

  onDnf2Change(dnf2: string) {
    this.setState({
      dnf2,
    });
  }

  async submitForm(e: React.FormEvent) {
    e.preventDefault();

    this.setState({
      error: '',
      success: '',
      isLoading: true,
    });

    const boardId = this.props.board.id;
    const { authenticityToken, componentRenderedAt } = this.props;
    const { title, description, attachments, isSubmissionAnonymous, dnf1, dnf2 } = this.state;

    if (title === '') {
      this.setState({
        error: I18n.t('board.new_post.no_title'),
        isLoading: false,
      });
      return;
    }

    try {
      let formDataObj = {
        'post[title]': title,
        'post[description]': description,
        'post[attachments][]': attachments,
        'post[board_id]': boardId,
        'post[is_anonymous]': isSubmissionAnonymous.toString(),
        'post[dnf1]': dnf1,
        'post[dnf2]': dnf2,
        'post[form_rendered_at]': componentRenderedAt,
      };

      const body = buildFormData(formDataObj);
      
      const res = await fetch('/posts', {
        method: 'POST',
        headers: { 'X-CSRF-Token': authenticityToken },
        body: body,
      });
      const json = await res.json();
      this.setState({isLoading: false});
      
      if (res.status === HttpStatus.Created) {
        if (json.approval_status === POST_APPROVAL_STATUS_APPROVED) {
          this.setState({
            success: I18n.t('board.new_post.submit_success'),
          });

          setTimeout(() => (
            window.location.href = `/posts/${json.slug || json.id}`
          ), 1000);
        } else {
          this.setState({
            success: I18n.t('board.new_post.submit_pending'),
            title: '',
            description: '',
            showForm: false,
          });
        }
      } else {
        this.setState({error: json.error});
      }

    } catch (e) {
      this.setState({
        error: I18n.t('common.errors.unknown')
      });
    }
  }
  
  render() {
    const {
      board,
      tenantSetting,
      isLoggedIn,
      currentUserFullName,
      isAnonymousFeedbackAllowed
    } = this.props;

    const {
      showForm,
      error,
      success,
      isLoading,
      
      title,
      description,
      attachments,
      isSubmissionAnonymous,

      dnf1,
      dnf2,
    } = this.state;

    return (
      <div className="newPostContainer sidebarBox">
        <span className="boardTitle">{board.name}</span>

        <ReactMarkdown
          className="boardDescription"
          disallowedTypes={['heading', 'image', 'html']}
          unwrapDisallowed
        >
          {board.description}
        </ReactMarkdown>

        {
          showForm ?
            <ActionLink
              onClick={this.toggleForm}
              icon={<CancelIcon />}
            >
              {I18n.t('common.buttons.cancel')}
            </ActionLink>
          :
            <Button
              onClick={() => {
                if (isLoggedIn) {
                  this.toggleForm();
                  this.setState({ isSubmissionAnonymous: false });
                } else {
                  window.location.href = '/users/sign_in';
                }
              }}
              className="submitBtn"
              outline={showForm}
            >
              {I18n.t('board.new_post.submit_button')}
            </Button>
        }

        {
          (isAnonymousFeedbackAllowed && !showForm) &&
            <div className="anonymousFeedbackLink">
              {I18n.t('common.words.or')}
              &nbsp;
              <a
                onClick={() => {
                  this.toggleForm();
                  this.setState({ isSubmissionAnonymous: true });
                }}
                className="link"
              >
                {I18n.t('board.new_post.submit_anonymous_button').toLowerCase()}
              </a>
            </div>
        }

        {
          showForm &&
            <NewPostForm
              title={title}
              description={description}
              attachments={attachments}
              handleTitleChange={this.onTitleChange}
              handleDescriptionChange={this.onDescriptionChange}
              handleAttachmentsChange={this.onAttachmentsChange}

              handleSubmit={this.submitForm}

              dnf1={dnf1}
              dnf2={dnf2}
              handleDnf1Change={this.onDnf1Change}
              handleDnf2Change={this.onDnf2Change}

              tenantSetting={tenantSetting}
              currentUserFullName={currentUserFullName}
              isSubmissionAnonymous={isSubmissionAnonymous}
            />
        }

        { isLoading ? <Spinner /> : null }
        { error ? <DangerText>{error}</DangerText> : null }
        { success ? <SuccessText>{success}</SuccessText> : null }
      </div>
    );
  }
}

export default NewPost;