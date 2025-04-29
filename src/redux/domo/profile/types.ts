import { PROFILE_FAILURE, PROFILE_REQUEST, PROFILE_SUCCESS } from "./constant";

export interface profileResType {
  id: number;
  displayName: string;
  avatarKey: string;
  role: string;
  roleId: number;
  detail: {
    title: string;
    email: string;
    phoneNumber: string;
    pending: boolean;
    location: string;
    active: boolean;
    created: number;
    modified: number;
    department: string;
  };
}

export interface profileRequestType {
  type: typeof PROFILE_REQUEST;
}

export interface profileSuccessType {
  type: typeof PROFILE_SUCCESS;
  payload: profileResType;
}

export interface profileFailureType {
  type: typeof PROFILE_FAILURE;
  payload: any;
}

export interface initialStateType {
  loading: boolean;
  error: any | null;
  data: profileResType | null;
}

export type profileActionType = profileRequestType | profileSuccessType | profileFailureType;
