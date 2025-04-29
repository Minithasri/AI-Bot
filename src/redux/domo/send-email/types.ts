import {
  EMAIL_SERVICE_REQUEST,
  EMAIL_SERVICE_SUCCESS,
  EMAIL_SERVICE_FAILURE,
  EMAIL_SERVICE_RESET,
} from "./constant";

export interface emailServiceResType {
  id: string;
  modelId: string;
  deploymentId: string;
  modelName: string;
  modelVersion: string;
  bpmnProcessId: string;
  bpmnProcessName: string;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  status: string;
  isTestRun: boolean;
}

export interface emailServiceReqType {
  to: string;
  subject: string;
  body: string;
}

export interface emailServiceRequestType {
  type: typeof EMAIL_SERVICE_REQUEST;
  payload: emailServiceReqType;
}

export interface emailServiceSuccessType {
  type: typeof EMAIL_SERVICE_SUCCESS;
  payload: emailServiceResType;
}

export interface emailServiceFailureType {
  type: typeof EMAIL_SERVICE_FAILURE;
  payload: string;
}

export interface emailServiceResetType {
  type: typeof EMAIL_SERVICE_RESET;
}

export interface initialStateType {
  loading: boolean;
  error: string | null;
  data: emailServiceResType | null;
}

export type emailServiceActionType =
  | emailServiceRequestType
  | emailServiceSuccessType
  | emailServiceFailureType
  | emailServiceResetType;
