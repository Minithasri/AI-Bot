import {
  CREATE_COLLECTION_REQUEST,
  CREATE_COLLECTION_SUCCESS,
  CREATE_COLLECTION_FAILURE,
  CREATE_COLLECTION_RESET,
} from "./constant";

import { createCollectionReqType, createCollectionResType } from "./types";

export const createCollectionRequest = (payload: createCollectionReqType) => ({
  type: CREATE_COLLECTION_REQUEST,
  payload,
});

export const createCollectionSuccess = (payload: createCollectionResType) => ({
  type: CREATE_COLLECTION_SUCCESS,
  payload,
});

export const createCollectionFailure = (payload: string) => ({
  type: CREATE_COLLECTION_FAILURE,
  payload,
});

export const createCollectionReset = () => ({
  type: CREATE_COLLECTION_RESET,
});
