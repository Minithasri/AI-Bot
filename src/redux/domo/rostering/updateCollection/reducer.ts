import {
  UPDATE_COLLECTION_REQUEST,
  UPDATE_COLLECTION_SUCCESS,
  UPDATE_COLLECTION_FAILURE,
  UPDATE_COLLECTION_RESET,
} from "./constant";
import { updateCollectionActionType, initialStateType } from "./types";

const initialState: initialStateType = {
  loading: false,
  error: null,
  data: null,
};

export const updateCollectionReducer = (
  state = initialState,
  action: updateCollectionActionType,
) => {
  switch (action.type) {
    case UPDATE_COLLECTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_COLLECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case UPDATE_COLLECTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_COLLECTION_RESET:
      return initialState;
    default:
      return state;
  }
};
