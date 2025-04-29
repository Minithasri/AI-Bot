import {
  CREATE_COLLECTION_REQUEST,
  CREATE_COLLECTION_SUCCESS,
  CREATE_COLLECTION_FAILURE,
  CREATE_COLLECTION_RESET,
} from "./constant";
import { createCollectionActionType, initialStateType } from "./types";

const initialState: initialStateType = {
  loading: false,
  error: null,
  data: null,
};

export const createCollectionReducer = (
  state = initialState,
  action: createCollectionActionType,
) => {
  switch (action.type) {
    case CREATE_COLLECTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_COLLECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case CREATE_COLLECTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_COLLECTION_RESET:
      return initialState;
    default:
      return state;
  }
};
