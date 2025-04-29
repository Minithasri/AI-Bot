import { call, put, takeEvery } from "redux-saga/effects";
import { profileFailure, profileSuccess } from "./actions";
import { PROFILE_REQUEST } from "./constant";
import domo from "ryuu.js";
import { profileResType } from "./types";

function* userCheck() {
  try {
    const response: profileResType = yield call(domo.get, "/domo/environment/v1");
    const data = response;
    yield put(profileSuccess(data));
  } catch (error) {
    yield put(profileFailure(error));
  }
}

function* userCheckSaga() {
  yield takeEvery(PROFILE_REQUEST, userCheck);
}

export default userCheckSaga;
