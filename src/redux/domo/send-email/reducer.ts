import {
  EMAIL_SERVICE_REQUEST,
  EMAIL_SERVICE_SUCCESS,
  EMAIL_SERVICE_FAILURE,
  EMAIL_SERVICE_RESET,
} from "./constant";
import { emailServiceActionType, initialStateType } from "./types";

const initialState: initialStateType = {
  loading: false,
  error: null,
  data: null,
};

export const emailServiceReducer = (state = initialState, action: emailServiceActionType) => {
  switch (action.type) {
    case EMAIL_SERVICE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case EMAIL_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case EMAIL_SERVICE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case EMAIL_SERVICE_RESET:
      return initialState;
    default:
      return state;
  }
};
