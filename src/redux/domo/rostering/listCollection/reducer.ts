import {
  LIST_COLLECTION_REQUEST,
  LIST_COLLECTION_SUCCESS,
  LIST_COLLECTION_FAILURE,
  LIST_COLLECTION_RESET,
} from "./constant";

import { listCollectionActionType, initialStateType } from "./types";

const initialState: initialStateType = {
  loading: false,
  error: null,
  data: null,
};

export const listCollectionReducer = (state = initialState, action: listCollectionActionType) => {
  switch (action.type) {
    case LIST_COLLECTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LIST_COLLECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case LIST_COLLECTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LIST_COLLECTION_RESET:
      return initialState;
    default:
      return state;
  }
};
