import {
  LIST_COLLECTION_REQUEST,
  LIST_COLLECTION_SUCCESS,
  LIST_COLLECTION_FAILURE,
  LIST_COLLECTION_RESET,
} from "./constant";

export interface listCollectionResType {
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

export interface extractCollectionType {
  id: number;
  owner: number;
  createdOn: string;
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

export interface listCollectionRequestType {
  type: typeof LIST_COLLECTION_REQUEST;
}

export interface listCollectionSuccessType {
  type: typeof LIST_COLLECTION_SUCCESS;
  payload: extractCollectionType[];
}

export interface listCollectionFailureType {
  type: typeof LIST_COLLECTION_FAILURE;
  payload: string;
}

export interface listCollectionResetType {
  type: typeof LIST_COLLECTION_RESET;
}

export interface initialStateType {
  loading: boolean;
  error: string | null;
  data: listCollectionResType | null;
}

export type listCollectionActionType =
  | listCollectionRequestType
  | listCollectionSuccessType
  | listCollectionFailureType
  | listCollectionResetType;
