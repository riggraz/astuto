import { connect } from 'react-redux';

import { requestComments } from '../actions/Comment/requestComments';
import {
  toggleCommentReply,
  setCommentReplyBody,
  toggleCommentIsPostUpdateFlag,
} from '../actions/Comment/handleCommentReplies';
import { submitComment } from '../actions/Comment/submitComment';
import { updateComment } from '../actions/Comment/updateComment';
import { deleteComment } from '../actions/Comment/deleteComment';

import { State } from '../reducers/rootReducer';

import CommentsP from '../components/Comments/CommentsP';
import HttpStatus from '../constants/http_status';

const mapStateToProps = (state: State) => ({
  comments: state.currentPost.comments.items,
  replyForms: state.currentPost.comments.replyForms,
  areLoading: state.currentPost.comments.areLoading,
  error: state.currentPost.comments.error,
});

const mapDispatchToProps = (dispatch) => ({
  requestComments(postId: number) {
    dispatch(requestComments(postId));
  },

  toggleCommentReply(commentId: number) {
    dispatch(toggleCommentReply(commentId));
  },

  setCommentReplyBody(commentId: number, body: string) {
    dispatch(setCommentReplyBody(commentId, body));
  },

  toggleCommentIsPostUpdateFlag() {
    dispatch(toggleCommentIsPostUpdateFlag(null));
  },

  submitComment(
    postId: number,
    body: string,
    parentId: number,
    isPostUpdate: boolean,
    attachments: File[],
    onSuccess: Function,
    authenticityToken: string,
  ) {
    dispatch(submitComment(postId, body, parentId, isPostUpdate, attachments, authenticityToken)).then(res => {
      if (res && res.status === HttpStatus.Created) onSuccess();
    });
  },

  updateComment(
    postId: number,
    commentId: number,
    body: string,
    isPostUpdate: boolean,
    attachmentsToDelete: number[],
    attachments: File[],
    onSuccess: Function,
    authenticityToken: string,
  ) {
    dispatch(updateComment(postId, commentId, body, isPostUpdate, attachmentsToDelete, attachments, authenticityToken)).then(res => {
      if (res && res.status === HttpStatus.OK) onSuccess();
    });
  },

  deleteComment(
    postId: number,
    commentId: number,
    authenticityToken: string,
  ) {
    dispatch(deleteComment(postId, commentId, authenticityToken));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsP);