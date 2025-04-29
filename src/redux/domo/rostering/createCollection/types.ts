import {
  CREATE_COLLECTION_REQUEST,
  CREATE_COLLECTION_SUCCESS,
  CREATE_COLLECTION_FAILURE,
  CREATE_COLLECTION_RESET,
} from "./constant";

export interface createCollectionResType {
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

export interface createCollectionReqType {
  date: string;
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

export interface createCollectionRequestType {
  type: typeof CREATE_COLLECTION_REQUEST;
  payload: createCollectionReqType;
}

export interface createCollectionSuccessType {
  type: typeof CREATE_COLLECTION_SUCCESS;
  payload: createCollectionResType;
}

export interface createCollectionFailureType {
  type: typeof CREATE_COLLECTION_FAILURE;
  payload: string;
}

export interface createCollectionResetType {
  type: typeof CREATE_COLLECTION_RESET;
}

export interface initialStateType {
  loading: boolean;
  error: string | null;
  data: createCollectionResType | null;
}

export type createCollectionActionType =
  | createCollectionRequestType
  | createCollectionSuccessType
  | createCollectionFailureType
  | createCollectionResetType;
