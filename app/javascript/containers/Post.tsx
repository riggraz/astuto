import { connect } from 'react-redux';

import { requestPost } from '../actions/Post/requestPost';
import { deletePost } from '../actions/Post/deletePost';
import { togglePostEditMode } from '../actions/Post/togglePostEditMode';
import {
  changePostEditFormBoard,
  changePostEditFormDescription,
  changePostEditFormPostStatus,
  changePostEditFormTitle
} from '../actions/Post/changePostEditForm';

import { requestLikes } from '../actions/Like/requestLikes';
import { submitFollow } from '../actions/Follow/submitFollow';
import { requestFollow } from '../actions/Follow/requestFollow';
import { requestPostStatusChanges } from '../actions/PostStatusChange/requestPostStatusChanges';
import { postStatusChangeSubmitted } from '../actions/PostStatusChange/submittedPostStatusChange';

import { State } from '../reducers/rootReducer';

import PostP from '../components/Post/PostP';

import { fromJavascriptDateToRailsString } from '../helpers/datetime';
import { updatePost } from '../actions/Post/updatePost';

const mapStateToProps = (state: State) => ({
  post: state.currentPost.item,
  editMode: state.currentPost.editMode,
  editForm: state.currentPost.editForm,
  likes: state.currentPost.likes,
  followed: state.currentPost.followed,
  comments: state.currentPost.comments,
  postStatusChanges: state.currentPost.postStatusChanges,
});

const mapDispatchToProps = (dispatch) => ({
  requestPost(postId: number): Promise<any> {
    return dispatch(requestPost(postId));
  },

  updatePost(
    postId: number,
    title: string,
    description: string,
    boardId: number,
    postStatusId: number,
    attachmentsToDelete: number[],
    attachments: File[],
    authenticityToken: string,
  ) {
    return dispatch(updatePost(postId, title, description, boardId, postStatusId, attachmentsToDelete, attachments, authenticityToken));
  },

  toggleEditMode() {
    dispatch(togglePostEditMode());
  },

  handleChangeEditFormTitle(title: string) {
    dispatch(changePostEditFormTitle(title));
  },

  handleChangeEditFormDescription(description: string) {
    dispatch(changePostEditFormDescription(description));
  },

  handleChangeEditFormBoard(boardId: number) {
    dispatch(changePostEditFormBoard(boardId));
  },

  handleChangeEditFormPostStatus(postStatusId: number) {
    dispatch(changePostEditFormPostStatus(postStatusId));
  },

  requestLikes(postId: number): Promise<any> {
    return dispatch(requestLikes(postId));
  },

  requestFollow(postId: number) {
    dispatch(requestFollow(postId));
  },

  requestPostStatusChanges(postId: number) {
    dispatch(requestPostStatusChanges(postId));
  },

  deletePost(postId: number, authenticityToken: string) {
    return dispatch(deletePost(postId, authenticityToken));
  },

  postStatusChangeSubmitted(
    newPostStatusId: number,
    userFullName: string,
    userEmail: string,
  ) {
    dispatch(postStatusChangeSubmitted({
      postStatusId: newPostStatusId,
      userFullName,
      userEmail,
      createdAt: fromJavascriptDateToRailsString(new Date()),
    }));
  },

  submitFollow(postId: number, isFollow: boolean, authenticityToken: string) {
    dispatch(submitFollow(postId, isFollow, authenticityToken));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostP);