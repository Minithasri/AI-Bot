import {
  DELETE_COLLECTION_REQUEST,
  DELETE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_FAILURE,
  DELETE_COLLECTION_RESET,
} from "./constant";
import { deleteCollectionType, initialStateType } from "./types";

const initialState: initialStateType = {
  loading: false,
  success: false,
  error: null,
};

export const deleteCollectionReducer = (state = initialState, action: deleteCollectionType) => {
  switch (action.type) {
    case DELETE_COLLECTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_COLLECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case DELETE_COLLECTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_COLLECTION_RESET:
      return initialState;
    default:
      return state;
  }
};
