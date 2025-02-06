import {
  CommentRequestSuccessAction,
  COMMENT_REQUEST_SUCCESS,
} from '../actions/Comment/requestComment';

import {
  CommentUpdateActionTypes,
  COMMENT_UPDATE_SUCCESS,
} from '../actions/Comment/updateComment';

import IComment from '../interfaces/IComment';

const initialState: IComment = {
  id: 0,
  body: '',
  parentId: null,
  isPostUpdate: false,
  attachmentUrls: [],
  userFullName: '<Unknown user>',
  userEmail: 'example@example.com',
  userAvatar: undefined,
  userRole: 0,
  createdAt: undefined,
  updatedAt: undefined,
};

const commentReducer = (
  state = initialState,
  action: CommentRequestSuccessAction | CommentUpdateActionTypes,
): IComment => {
  switch (action.type) {
    case COMMENT_REQUEST_SUCCESS:
    case COMMENT_UPDATE_SUCCESS:
      return {
        id: action.comment.id,
        body: action.comment.body,
        parentId: action.comment.parent_id,
        isPostUpdate: action.comment.is_post_update,
        attachmentUrls: action.comment.attachment_urls,
        userFullName: action.comment.user_full_name,
        userEmail: action.comment.user_email,
        userAvatar: action.comment.user_avatar,
        userRole: action.comment.user_role,
        createdAt: action.comment.created_at,
        updatedAt: action.comment.updated_at,
      };

    default:
      return state;
  }
}

export default commentReducer;