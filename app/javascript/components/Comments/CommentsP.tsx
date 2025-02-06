import * as React from 'react';
import I18n from 'i18n-js';

import NewComment from './NewComment';
import CommentList from './CommentList';
import Spinner from '../common/Spinner';
import { DangerText, MutedText } from '../common/CustomTexts';

import IComment from '../../interfaces/IComment';
import { ReplyFormState } from '../../reducers/replyFormReducer';
import Separator from '../common/Separator';
import ITenantSetting from '../../interfaces/ITenantSetting';

interface Props {
  postId: number;
  tenantSetting: ITenantSetting;
  isLoggedIn: boolean;
  isPowerUser: boolean;
  userEmail: string;
  userAvatar?: string;
  authenticityToken: string;

  comments: Array<IComment>;
  replyForms: Array<ReplyFormState>;
  areLoading: boolean;
  error: string;

  requestComments(postId: number, page?: number): void;
  toggleCommentReply(commentId: number): void;
  setCommentReplyBody(commentId: number, body: string): void;
  toggleCommentIsPostUpdateFlag(): void;

  submitComment(
    postId: number,
    body: string,
    parentId: number,
    isPostUpdate: boolean,
    attachments: File[],
    onSuccess: Function,
    authenticityToken: string,
  ): void;
  updateComment(
    postId: number,
    commentId: number,
    body: string,
    isPostUpdate: boolean,
    attachmentsToDelete: number[],
    attachments: File[],
    onSuccess: Function,
    authenticityToken: string,
  ): void;
  deleteComment(
    postId: number,
    commentId: number,
    authenticityToken: string,
  ): void;
}

class CommentsP extends React.Component<Props> {
  componentDidMount() {
    this.props.requestComments(this.props.postId);
  }

  _handleSubmitComment = (body: string, parentId: number, isPostUpdate: boolean, attachments: File[], onSuccess: Function) => {
    this.props.submitComment(
      this.props.postId,
      body,
      parentId,
      isPostUpdate,
      attachments,
      onSuccess,
      this.props.authenticityToken,
    );
  }

  _handleUpdateComment = (commentId: number, body: string, isPostUpdate: boolean, attachmentsToDelete: number[], attachments: File[], onSuccess: Function) => {
    this.props.updateComment(
      this.props.postId,
      commentId,
      body,
      isPostUpdate,
      attachmentsToDelete,
      attachments,
      onSuccess,
      this.props.authenticityToken,
    );
  }

  _handleDeleteComment = (commentId: number) => {
    this.props.deleteComment(
      this.props.postId,
      commentId,
      this.props.authenticityToken,
    );
  }

  render() {
    const {
      tenantSetting,
      isLoggedIn,
      isPowerUser,
      userEmail,
      userAvatar,

      comments,
      replyForms,
      areLoading,
      error,

      toggleCommentReply,
      setCommentReplyBody,
      toggleCommentIsPostUpdateFlag,
    } = this.props;

    const postReply = replyForms.find(replyForm => replyForm.commentId === null);

    return (
      <div className="commentsContainer">
        <NewComment
          body={postReply && postReply.body}
          parentId={null}
          postUpdateFlagValue={postReply && postReply.isPostUpdate}
          isSubmitting={postReply && postReply.isSubmitting}
          error={postReply && postReply.error}
          handleChange={
            (e: React.FormEvent) => (
              setCommentReplyBody(null, (e.target as HTMLTextAreaElement).value)
            )
          }
          handlePostUpdateFlag={toggleCommentIsPostUpdateFlag}
          handleSubmit={this._handleSubmitComment}

          allowAttachmentUpload={tenantSetting.allow_attachment_upload}
          isLoggedIn={isLoggedIn}
          isPowerUser={isPowerUser}
          userEmail={userEmail}
          userAvatar={userAvatar}
        />

        <div className="commentsTitle">
          {I18n.t('post.comments.title')}
          <Separator />
          {I18n.t('common.comments_number', { count: comments.length })}
        </div>

        { areLoading ? <Spinner /> : null }
        { error ? <DangerText>{error}</DangerText> : null }
        { comments.length === 0 && !areLoading && !error && <MutedText>{I18n.t('post.comments.empty')}</MutedText> }

        <CommentList
          comments={comments}
          replyForms={replyForms}
          toggleCommentReply={toggleCommentReply}
          setCommentReplyBody={setCommentReplyBody}
          handleSubmitComment={this._handleSubmitComment}
          handleUpdateComment={this._handleUpdateComment}
          handleDeleteComment={this._handleDeleteComment}
          parentId={null}
          level={1}
          tenantSetting={tenantSetting}
          isLoggedIn={isLoggedIn}
          isPowerUser={isPowerUser}
          userEmail={userEmail}
          userAvatar={userAvatar}
        />
      </div>
    );
  }
}

export default CommentsP;