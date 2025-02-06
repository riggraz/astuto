import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import HttpStatus from "../../constants/http_status";
import buildRequestHeaders from "../../helpers/buildRequestHeaders";
import IPostJSON from "../../interfaces/json/IPost";
import { State } from "../../reducers/rootReducer";
import { PostApprovalStatus } from "../../interfaces/IPost";
import buildFormData from "../../helpers/buildFormData";

export const POST_UPDATE_START = 'POST_UPDATE_START';
interface PostUpdateStartAction {
  type: typeof POST_UPDATE_START;
}

export const POST_UPDATE_SUCCESS = 'POST_UPDATE_SUCCESS';
interface PostUpdateSuccessAction {
  type: typeof POST_UPDATE_SUCCESS;
  post: IPostJSON;
}

export const POST_UPDATE_FAILURE = 'POST_UPDATE_FAILURE';
interface PostUpdateFailureAction {
  type: typeof POST_UPDATE_FAILURE;
  error: string;
}

export type PostUpdateActionTypes =
  PostUpdateStartAction |
  PostUpdateSuccessAction |
  PostUpdateFailureAction;

const postUpdateStart = (): PostUpdateStartAction => ({
  type: POST_UPDATE_START,
});

export const postUpdateSuccess = (
  postJSON: IPostJSON,
): PostUpdateSuccessAction => ({
  type: POST_UPDATE_SUCCESS,
  post: postJSON,
});

const postUpdateFailure = (error: string): PostUpdateFailureAction => ({
  type: POST_UPDATE_FAILURE,
  error,
});

export const updatePost = (
  id: number,
  title: string,
  description: string,
  boardId: number,
  postStatusId: number,
  attachmentsToDelete: number[],
  attachments: File[],
  authenticityToken: string,
): ThunkAction<void, State, null, Action<string>> => async (dispatch) => {
  dispatch(postUpdateStart());

  try {
    let formDataObj = {
      'post[title]': title,
      'post[description]': description,
      'post[board_id]': boardId,
      'post[post_status_id]': postStatusId,
      'post[attachments_to_delete][]': attachmentsToDelete,
      'post[attachments][]': attachments,
    };

    const body = buildFormData(formDataObj);

    const res = await fetch(`/posts/${id}`, {
      method: 'PATCH',
      headers: { 'X-CSRF-Token': authenticityToken },
      body,
    });
    const json = await res.json();

    if (res.status === HttpStatus.OK) {
      dispatch(postUpdateSuccess(json));
    } else {
      dispatch(postUpdateFailure(json.error));
    }

    return Promise.resolve(res);
  } catch (e) {
    dispatch(postUpdateFailure(e));
    
    return Promise.resolve(null);
  }
};

export const updatePostApprovalStatus = (
  id: number,
  approvalStatus: PostApprovalStatus,
  authenticityToken: string,
): ThunkAction<void, State, null, Action<string>> => async (dispatch) => {
  dispatch(postUpdateStart());

  try {
    const res = await fetch(`/posts/${id}`, {
      method: 'PATCH',
      headers: buildRequestHeaders(authenticityToken),
      body: JSON.stringify({
        post: {
          approval_status: approvalStatus,
        }
      }),
    });
    const json = await res.json();

    if (res.status === HttpStatus.OK) {
      dispatch(postUpdateSuccess(json));
    } else {
      dispatch(postUpdateFailure(json.error));
    }

    return Promise.resolve(res);
  } catch (e) {
    dispatch(postUpdateFailure(e));
    
    return Promise.resolve(null);
  }
};