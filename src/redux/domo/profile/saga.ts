/* eslint-disable prettier/prettier */
import { call, put, takeEvery } from "redux-saga/effects";
import { profileFailure, profileSuccess } from "./actions";
import { PROFILE_REQUEST } from "./constant";
import domo from "ryuu.js";
import { profileResType } from "./types";

function* userCheck() {
  try {
    const query = `SELECT Name FROM "Consultant Details" `;

    const response: profileResType = yield call(domo.get, "/domo/v1/consultant",{sql:query});
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
