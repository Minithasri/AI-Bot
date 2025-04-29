import {
  UPDATE_COLLECTION_REQUEST,
  UPDATE_COLLECTION_SUCCESS,
  UPDATE_COLLECTION_FAILURE,
  UPDATE_COLLECTION_RESET,
} from "./constant";

export interface updateCollectionResType {
  id: string;
  datastoreId: string;
  collectionId: string;
  syncRequired: boolean;
  owner: number;
  createdOn: string;
  updatedOn: string;
  updatedBy: number;
  content: {
    date: Date;
    fromHour: string;
    toHour: string;
    position: string;
    employee: string;
    employmentType: string;
    location: string;
    duration: string;
    time: string;
    color: string;
  };
}

export interface updateCollectionReqType {
  documentId: string;
  date: Date;
  fromHour: string;
  toHour: string;
  position: string;
  employee: string;
  employmentType: string;
  location: string;
  duration: string;
  time: string;
  color: string;
}

export interface updateCollectionRequestType {
  type: typeof UPDATE_COLLECTION_REQUEST;
  payload: updateCollectionReqType;
}

export interface updateCollectionSuccessType {
  type: typeof UPDATE_COLLECTION_SUCCESS;
  payload: updateCollectionResType;
}

export interface updateCollectionFailureType {
  type: typeof UPDATE_COLLECTION_FAILURE;
  payload: string;
}

export interface updateCollectionResetType {
  type: typeof UPDATE_COLLECTION_RESET;
}

export interface initialStateType {
  loading: boolean;
  error: string | null;
  data: updateCollectionResType | null;
}

export type updateCollectionActionType =
  | updateCollectionRequestType
  | updateCollectionSuccessType
  | updateCollectionFailureType
  | updateCollectionResetType;
