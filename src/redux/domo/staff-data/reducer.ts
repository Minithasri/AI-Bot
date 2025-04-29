import {
  STAFF_REQMT_LIST_REQUEST,
  STAFF_REQMT_LIST_SUCCESS,
  STAFF_REQMT_LIST_FAILURE,
  STAFF_REQMT_LIST_RESET,
} from "./constant";

import { staffReqmtListActionType, initialStateType } from "./types";

const initialState: initialStateType = {
  loading: false,
  error: null,
  data: null,
};

export const staffReqmtListReducer = (state = initialState, action: staffReqmtListActionType) => {
  switch (action.type) {
    case STAFF_REQMT_LIST_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case STAFF_REQMT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case STAFF_REQMT_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case STAFF_REQMT_LIST_RESET:
      return initialState;
    default:
      return state;
  }
};
