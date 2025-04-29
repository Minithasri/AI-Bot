import {
  LIST_COLLECTION_REQUEST,
  LIST_COLLECTION_SUCCESS,
  LIST_COLLECTION_FAILURE,
  LIST_COLLECTION_RESET,
} from "./constant";

import { extractCollectionType } from "./types";

export const listCollectionRequest = () => ({
  type: LIST_COLLECTION_REQUEST,
});

export const listCollectionSuccess = (payload: extractCollectionType[]) => ({
  type: LIST_COLLECTION_SUCCESS,
  payload,
});

export const listCollectionFailure = (payload: string) => ({
  type: LIST_COLLECTION_FAILURE,
  payload,
});

export const listCollectionReset = () => ({
  type: LIST_COLLECTION_RESET,
});
