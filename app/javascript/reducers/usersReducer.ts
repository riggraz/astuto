import {
  UsersRequestActionTypes,
  USERS_REQUEST_START,
  USERS_REQUEST_SUCCESS,
  USERS_REQUEST_FAILURE,
} from '../actions/User/requestUsers';

import {
  UserUpdateActionTypes,
  USER_UPDATE_SUCCESS,
} from '../actions/User/updateUser';

import IUser from "../interfaces/IUser";

export interface UsersState {
  items: Array<IUser>;
  areLoading: boolean;
  error: string;
}

const initialState: UsersState = {
  items: [],
  areLoading: false,
  error: '',
};

const usersReducer = (
  state = initialState,
  action: UsersRequestActionTypes | UserUpdateActionTypes,
) => {
  switch (action.type) {
    case USERS_REQUEST_START:
      return {
        ...state,
        areLoading: true,
      };

    case USERS_REQUEST_SUCCESS:
      return {
        ...state,
        areLoading: false,
        error: '',
        items: action.users.map(userJson => ({
          id: userJson.id,
          email: userJson.email,
          fullName: userJson.full_name,
          avatarUrl: userJson.avatar_url,
          role: userJson.role,
          status: userJson.status,
        })),
      };

    case USERS_REQUEST_FAILURE:
      return {
        ...state,
        areLoading: false,
        error: action.error,
      };

    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        items: state.items.map(user => {
          return (user.id === action.user.id) ?
            {...user, role: action.user.role, status: action.user.status}
          :
            user;
        }),
      };
    
    default:
      return state;
  }
}

export default usersReducer;