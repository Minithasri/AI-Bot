import {
  EMAIL_SERVICE_REQUEST,
  EMAIL_SERVICE_SUCCESS,
  EMAIL_SERVICE_FAILURE,
  EMAIL_SERVICE_RESET,
} from "./constant";

import { emailServiceReqType, emailServiceResType } from "./types";

export const emailServiceRequest = (payload: emailServiceReqType) => ({
  type: EMAIL_SERVICE_REQUEST,
  payload,
});

export const emailServiceSuccess = (payload: emailServiceResType) => ({
  type: EMAIL_SERVICE_SUCCESS,
  payload,
});

export const emailServiceFailure = (payload: string) => ({
  type: EMAIL_SERVICE_FAILURE,
  payload,
});

export const emailServiceReset = () => ({
  type: EMAIL_SERVICE_RESET,
});
