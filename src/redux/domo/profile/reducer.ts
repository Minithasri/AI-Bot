import { PROFILE_FAILURE, PROFILE_REQUEST, PROFILE_SUCCESS } from "./constant";
import { initialStateType, profileActionType } from "./types";

const initialState: initialStateType = {
  loading: false,
  error: null,
  data: null,
};

export const profileReducer = (state = initialState, action: profileActionType) => {
  switch (action.type) {
    case PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
