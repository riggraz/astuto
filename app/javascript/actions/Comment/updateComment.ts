import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import HttpStatus from "../../constants/http_status";
import buildRequestHeaders from "../../helpers/buildRequestHeaders";
import ICommentJSON from "../../interfaces/json/IComment";
import { State } from "../../reducers/rootReducer";
import buildFormData from "../../helpers/buildFormData";

export const COMMENT_UPDATE_START = 'COMMENT_UPDATE_START';
interface CommentUpdateStartAction {
  type: typeof COMMENT_UPDATE_START;
}

export const COMMENT_UPDATE_SUCCESS = 'COMMENT_UPDATE_SUCCESS';
interface CommentUpdateSuccessAction {
  type: typeof COMMENT_UPDATE_SUCCESS;
  comment: ICommentJSON;
}

export const COMMENT_UPDATE_FAILURE = 'COMMENT_UPDATE_FAILURE';
interface CommentUpdateFailureAction {
  type: typeof COMMENT_UPDATE_FAILURE;
  error: string;
}

export type CommentUpdateActionTypes =
  CommentUpdateStartAction |
  CommentUpdateSuccessAction |
  CommentUpdateFailureAction;

const commentUpdateStart = (): CommentUpdateStartAction => ({
  type: COMMENT_UPDATE_START,
});

const commentUpdateSuccess = (
  commentJSON: ICommentJSON,
): CommentUpdateSuccessAction => ({
  type: COMMENT_UPDATE_SUCCESS,
  comment: commentJSON,
});

const commentUpdateFailure = (error: string): CommentUpdateFailureAction => ({
  type: COMMENT_UPDATE_FAILURE,
  error,
});

export const updateComment = (
  postId: number,
  commentId: number,
  body: string,
  isPostUpdate: boolean,
  attachmentsToDelete: number[],
  attachments: File[],
  authenticityToken: string,
): ThunkAction<void, State, null, Action<string>> => async (dispatch) => {
  dispatch(commentUpdateStart());

  try {
    let formDataObj = {
      'comment[body]': body,
      'comment[is_post_update]': isPostUpdate,
      'comment[attachments_to_delete][]': attachmentsToDelete,
      'comment[attachments][]': attachments,
    };
    const requestBody = buildFormData(formDataObj);

    const res = await fetch(`/posts/${postId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'X-CSRF-Token': authenticityToken },
      body: requestBody,
    });
    const json = await res.json();

    if (res.status === HttpStatus.OK) {
      dispatch(commentUpdateSuccess(json));
    } else {
      dispatch(commentUpdateFailure(json.error));
    }

    return Promise.resolve(res);
  } catch (e) {
    dispatch(commentUpdateFailure(e));
    
    return Promise.resolve(null);
  }
};