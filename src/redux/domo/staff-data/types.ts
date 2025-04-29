import {
  STAFF_REQMT_LIST_REQUEST,
  STAFF_REQMT_LIST_SUCCESS,
  STAFF_REQMT_LIST_FAILURE,
  STAFF_REQMT_LIST_RESET,
} from "./constant";

export interface staffReqmtListResType {
  employee: string;
  position: string;
  employmentType: string;
  location: string;
  __documentId__: string;
  __createdBy__: string;
  __created__: string;
  __modifiedBy__: string;
  __modified__: string;
  Location_from: string;
  Location_to: string;
  Distance_km: number;
  "New Location": string;
}

export interface staffReqmtListRequestType {
  type: typeof STAFF_REQMT_LIST_REQUEST;
}

export interface staffReqmtListSuccessType {
  type: typeof STAFF_REQMT_LIST_SUCCESS;
  payload: staffReqmtListResType[];
}

export interface staffReqmtListFailureType {
  type: typeof STAFF_REQMT_LIST_FAILURE;
  payload: string;
}

export interface staffReqmtListResetType {
  type: typeof STAFF_REQMT_LIST_RESET;
}

export interface initialStateType {
  loading: boolean;
  error: string | null;
  data: staffReqmtListResType | null;
}

export type staffReqmtListActionType =
  | staffReqmtListRequestType
  | staffReqmtListSuccessType
  | staffReqmtListFailureType
  | staffReqmtListResetType;
