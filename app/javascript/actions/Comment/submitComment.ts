import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { State } from '../../reducers/rootReducer';

import ICommentJSON from '../../interfaces/json/IComment';
import HttpStatus from '../../constants/http_status';
import buildFormData from '../../helpers/buildFormData';

export const COMMENT_SUBMIT_START = 'COMMENT_SUBMIT_START';
interface CommentSubmitStartAction {
  type: typeof COMMENT_SUBMIT_START;
  parentId: number;
}

export const COMMENT_SUBMIT_SUCCESS = 'COMMENT_SUBMIT_SUCCESS';
interface CommentSubmitSuccessAction {
  type: typeof COMMENT_SUBMIT_SUCCESS;
  comment: ICommentJSON;
}

export const COMMENT_SUBMIT_FAILURE = 'COMMENT_SUBMIT_FAILURE';
interface CommentSubmitFailureAction {
  type: typeof COMMENT_SUBMIT_FAILURE;
  parentId: number;
  error: string;
}

export type CommentSubmitActionTypes =
  CommentSubmitStartAction |
  CommentSubmitSuccessAction |
  CommentSubmitFailureAction;

const commentSubmitStart = (parentId: number): CommentSubmitStartAction => ({
  type: COMMENT_SUBMIT_START,
  parentId,
});

const commentSubmitSuccess = (
  commentJSON: ICommentJSON,
): CommentSubmitSuccessAction => ({
  type: COMMENT_SUBMIT_SUCCESS,
  comment: commentJSON,
});

const commentSubmitFailure = (parentId: number, error: string): CommentSubmitFailureAction => ({
  type: COMMENT_SUBMIT_FAILURE,
  parentId,
  error,
});

export const submitComment = (
  postId: number,
  body: string,
  parentId: number,
  isPostUpdate: boolean,
  attachments: File[],
  authenticityToken: string,
): ThunkAction<void, State, null, Action<string>> => async (dispatch) => {
  dispatch(commentSubmitStart(parentId));

  try {
    let formDataObj = {
      'comment[body]': body,
      'comment[parent_id]': parentId,
      'comment[is_post_update]': isPostUpdate,
      'comment[attachments][]': attachments,
    };
    const requestBody = buildFormData(formDataObj);

    const res = await fetch(`/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'X-CSRF-Token': authenticityToken },
      body: requestBody,
    });
    const json = await res.json();

    if (res.status === HttpStatus.Created) {
      dispatch(commentSubmitSuccess(json));
    } else {
      dispatch(commentSubmitFailure(parentId, json.error));
    }

    return Promise.resolve(res);
  } catch (e) {
    dispatch(commentSubmitFailure(parentId, e));

    return Promise.resolve(null);
  }
}