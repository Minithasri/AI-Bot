import {
  DELETE_COLLECTION_REQUEST,
  DELETE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_FAILURE,
  DELETE_COLLECTION_RESET,
} from "./constant";
import { deleteCollectionReqType } from "./types";

export const deleteCollectionRequest = (payload: deleteCollectionReqType) => ({
  type: DELETE_COLLECTION_REQUEST,
  payload,
});

export const deleteCollectionSuccess = () => ({
  type: DELETE_COLLECTION_SUCCESS,
});

export const deleteCollectionFailure = (payload: string) => ({
  type: DELETE_COLLECTION_FAILURE,
  payload,
});

export const deleteCollectionReset = () => ({
  type: DELETE_COLLECTION_RESET,
});
