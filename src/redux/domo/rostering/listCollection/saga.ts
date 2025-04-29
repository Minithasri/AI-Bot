/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeEvery } from "redux-saga/effects";
import { listCollectionSuccess, listCollectionFailure } from "./actions";
import { LIST_COLLECTION_REQUEST } from "./constant";
import domo from "ryuu.js";
import { listCollectionResType, extractCollectionType } from "./types";

function* listCollection() {
  try {
    const response: listCollectionResType[] = yield call(
      domo.get,
      "/domo/datastores/v1/collections/staffing_app_final/documents/",
    );
    const data: extractCollectionType[] = response?.map((item: any) => ({
      id: item.id,
      owner: item.owner,
      createdOn: item.createdOn,
      date: item.content.date,
      fromHour: item.content.fromHour,
      toHour: item.content.toHour,
      position: item.content.position,
      employee: item.content.employee,
      employmentType: item.content.employmentType,
      location: item.content.location,
      duration: item.content.duration,
      time: item.content.time,
      color: item.content.color,
    }));
    yield put(listCollectionSuccess(data));
  } catch (error) {
    yield put(listCollectionFailure("something went wrong on the list collection."));
  }
}

function* listCollectionSaga() {
  yield takeEvery(LIST_COLLECTION_REQUEST, listCollection);
}

export default listCollectionSaga;
