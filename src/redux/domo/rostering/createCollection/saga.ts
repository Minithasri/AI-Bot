import { call, put, takeEvery } from "redux-saga/effects";
import { createCollectionSuccess, createCollectionFailure } from "./actions";
import { CREATE_COLLECTION_REQUEST } from "./constant";
import domo from "ryuu.js";
import { createCollectionRequestType, createCollectionResType } from "./types";

function* createCollection(action: createCollectionRequestType) {
  try {
    const document = action.payload;
    const response: createCollectionResType = yield call(
      domo.post,
      "/domo/datastores/v1/collections/staffing_app_final/documents/",
      {
        content: document,
      },
    );
    const data = response;
    yield put(createCollectionSuccess(data));
  } catch (error) {
    yield put(createCollectionFailure("Something went wrong on the create collection."));
  }
}

function* createCollectionSaga() {
  yield takeEvery(CREATE_COLLECTION_REQUEST, createCollection);
}

export default createCollectionSaga;
