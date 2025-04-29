import {
  DELETE_COLLECTION_REQUEST,
  DELETE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_FAILURE,
  DELETE_COLLECTION_RESET,
} from "./constant";

export interface deleteCollectionReqType {
  documentId: string;
}

export interface deleteCollectionRequestType {
  type: typeof DELETE_COLLECTION_REQUEST;
  payload: deleteCollectionReqType;
}

export interface deleteCollectionSuccessType {
  type: typeof DELETE_COLLECTION_SUCCESS;
}

export interface deleteCollectionFailureType {
  type: typeof DELETE_COLLECTION_FAILURE;
  payload: string;
}

export interface deleteCollectionResetType {
  type: typeof DELETE_COLLECTION_RESET;
}

export interface initialStateType {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export type deleteCollectionType =
  | deleteCollectionRequestType
  | deleteCollectionSuccessType
  | deleteCollectionFailureType
  | deleteCollectionResetType;
