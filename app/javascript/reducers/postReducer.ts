import {
  PostRequestActionTypes,
  POST_REQUEST_SUCCESS,
} from '../actions/Post/requestPost';

import {
  PostUpdateActionTypes,
  POST_UPDATE_SUCCESS,
} from '../actions/Post/updatePost';

import IPost, { POST_APPROVAL_STATUS_APPROVED } from '../interfaces/IPost';

const initialState: IPost = {
  id: 0,
  title: '',
  slug: null,
  description: null,
  attachmentUrls: [],
  hasAttachments: false,
  approvalStatus: POST_APPROVAL_STATUS_APPROVED,
  boardId: 0,
  postStatusId: null,
  likeCount: 0,
  liked: 0,
  commentsCount: 0,
  hotness: 0,
  userId: 0,
  userEmail: '',
  userFullName: '',
  userAvatar: '',
  createdAt: '',
};

const postReducer = (
  state = initialState,
  action:
    PostRequestActionTypes |
    PostUpdateActionTypes
): IPost => {
  switch (action.type) {
    case POST_REQUEST_SUCCESS:
      return {
        id: action.post.id,
        title: action.post.title,
        slug: action.post.slug,
        description: action.post.description,
        attachmentUrls: action.post.attachment_urls,
        hasAttachments: action.post.has_attachments,
        approvalStatus: action.post.approval_status,
        boardId: action.post.board_id,
        postStatusId: action.post.post_status_id,
        likeCount: action.post.likes_count,
        liked: action.post.liked,
        commentsCount: action.post.comments_count,
        hotness: action.post.hotness,
        userId: action.post.user_id,
        userEmail: action.post.user_email,
        userFullName: action.post.user_full_name,
        userAvatar: action.post.user_avatar,
        createdAt: action.post.created_at,
      };

    case POST_UPDATE_SUCCESS:
      return {
        ...state,
        title: action.post.title,
        description: action.post.description,
        attachmentUrls: action.post.attachment_urls,
        boardId: action.post.board_id,
        postStatusId: action.post.post_status_id,
        approvalStatus: action.post.approval_status,
      };

    default:
      return state;
  }
}

export default postReducer;