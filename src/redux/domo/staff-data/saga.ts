/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { call, put, takeEvery } from "redux-saga/effects";
import { staffReqmtListSuccess, staffReqmtListFailure } from "./actions";
import { STAFF_REQMT_LIST_REQUEST } from "./constant";
import domo from "ryuu.js";
import { staffReqmtListResType } from "./types";

function* staffReqmtList() {
  try {
    const response: staffReqmtListResType[] = yield call(domo.get, "/data/v1/UnmatchedUnprocessedRecords");
    yield put(staffReqmtListSuccess(response));
  } catch (error) {
    yield put(staffReqmtListFailure("something went wrong on the list collection."));
  }
}

function* staffReqmtListSaga() {
  yield takeEvery(STAFF_REQMT_LIST_REQUEST, staffReqmtList);
}

export default staffReqmtListSaga;
