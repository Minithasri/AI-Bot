import {
  STAFF_REQMT_LIST_REQUEST,
  STAFF_REQMT_LIST_SUCCESS,
  STAFF_REQMT_LIST_FAILURE,
  STAFF_REQMT_LIST_RESET,
} from "./constant";
import { staffReqmtListResType } from "./types";

export const staffReqmtListRequest = () => ({
  type: STAFF_REQMT_LIST_REQUEST,
});

export const staffReqmtListSuccess = (payload: staffReqmtListResType[]) => ({
  type: STAFF_REQMT_LIST_SUCCESS,
  payload,
});

export const staffReqmtListFailure = (payload: string) => ({
  type: STAFF_REQMT_LIST_FAILURE,
  payload,
});

export const staffReqmtListReset = () => ({
  type: STAFF_REQMT_LIST_RESET,
});
