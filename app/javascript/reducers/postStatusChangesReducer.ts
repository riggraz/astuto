import {
  PostStatusChangesRequestActionTypes,
  POST_STATUS_CHANGES_REQUEST_START,
  POST_STATUS_CHANGES_REQUEST_SUCCESS,
  POST_STATUS_CHANGES_REQUEST_FAILURE,
} from "../actions/PostStatusChange/requestPostStatusChanges";

import {
  PostStatusChangeSubmitted,
  POST_STATUS_CHANGE_SUBMITTED
} from '../actions/PostStatusChange/submittedPostStatusChange';

import IPostStatusChange from "../interfaces/IPostStatusChange";

export interface PostStatusChangesState {
  items: Array<IPostStatusChange>;
  areLoading: boolean;
  error: string;
}

const initialState: PostStatusChangesState = {
  items: [],
  areLoading: false,
  error: '',
};

const postStatusChangesReducer = (
  state = initialState,
  action:
    PostStatusChangesRequestActionTypes |
    PostStatusChangeSubmitted
) => {
  switch (action.type) {
    case POST_STATUS_CHANGES_REQUEST_START:
      return {
        ...state,
        areLoading: true,
      };

    case POST_STATUS_CHANGES_REQUEST_SUCCESS:
      return {
        ...state,
        items: action.postStatusChanges.map(postStatusChange => ({
          postStatusId: postStatusChange.post_status_id,
          userFullName: postStatusChange.user_full_name,
          userEmail: postStatusChange.user_email,
          userAvatar: postStatusChange.user_avatar,
          createdAt: postStatusChange.created_at,
        })),
        areLoading: false,
        error: '',
      };

    case POST_STATUS_CHANGES_REQUEST_FAILURE:
      return {
        ...state,
        areLoading: false,
        error: action.error,
      };

    case POST_STATUS_CHANGE_SUBMITTED:
      return {
        ...state,
        items: [action.postStatusChange, ...state.items],
      };

    default:
      return state;
  }
}

export default postStatusChangesReducer;