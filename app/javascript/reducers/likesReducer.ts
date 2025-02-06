import {
  LikesRequestActionTypes,
  LIKES_REQUEST_START,
  LIKES_REQUEST_SUCCESS,
  LIKES_REQUEST_FAILURE,
} from '../actions/Like/requestLikes';

import {
  LikeActionTypes,
  LIKE_SUBMIT_SUCCESS,
} from '../actions/Like/submitLike';

import ILike from '../interfaces/ILike';

export interface LikesState {
  items: Array<ILike>;
  areLoading: boolean;
  error: string;
}

const initialState: LikesState = {
  items: [],
  areLoading: false,
  error: '',
};

const likesReducer = (
  state = initialState,
  action: LikesRequestActionTypes | LikeActionTypes,
) => {
  switch (action.type) {
    case LIKES_REQUEST_START:
      return {
        ...state,
        areLoading: true,
      };

    case LIKES_REQUEST_SUCCESS:
      return {
        ...state,
        items: action.likes.map(like => ({
          id: like.id,
          fullName: like.full_name,
          email: like.email,
          userAvatar: like.user_avatar,
        })),
        areLoading: false,
        error: '',
      };

    case LIKES_REQUEST_FAILURE:
      return {
        ...state,
        areLoading: false,
        error: action.error,
      };

    case LIKE_SUBMIT_SUCCESS:
      if (action.isLike) {
        return {
          ...state,
          items: [
            {
              id: action.like.id,
              fullName: action.like.full_name,
              email: action.like.email,
              userAvatar: action.like.user_avatar,
            },
            ...state.items,
          ],
        };
      } else {
        return {
          ...state,
          items: state.items.filter(like => like.id !== action.like.id),
        };
      }

    default:
      return state;
  }
}

export default likesReducer;