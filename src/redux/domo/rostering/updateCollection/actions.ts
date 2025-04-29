import {
  UPDATE_COLLECTION_REQUEST,
  UPDATE_COLLECTION_SUCCESS,
  UPDATE_COLLECTION_FAILURE,
  UPDATE_COLLECTION_RESET,
} from "./constant";
import { updateCollectionReqType, updateCollectionResType } from "./types";

export const updateCollectionRequest = (payload: updateCollectionReqType) => ({
  type: UPDATE_COLLECTION_REQUEST,
  payload,
});

export const updateCollectionSuccess = (payload: updateCollectionResType) => ({
  type: UPDATE_COLLECTION_SUCCESS,
  payload,
});

export const updateCollectionFailure = (payload: string) => ({
  type: UPDATE_COLLECTION_FAILURE,
  payload,
});

export const updateCollectionReset = () => ({
  type: UPDATE_COLLECTION_RESET,
});
