/* eslint-disable @typescript-eslint/no-explicit-any */
import { PROFILE_FAILURE, PROFILE_REQUEST, PROFILE_SUCCESS } from "./constant";
import { profileResType } from "./types";

export const profileRequest = () => ({
  type: PROFILE_REQUEST,
});

export const profileSuccess = (data: profileResType) => ({
  type: PROFILE_SUCCESS,
  payload: data,
});

export const profileFailure = (error: any) => ({
  type: PROFILE_FAILURE,
  payload: error,
});
