import { call, put, takeEvery } from "redux-saga/effects";
import { updateCollectionSuccess, updateCollectionFailure } from "./actions";
import { UPDATE_COLLECTION_REQUEST } from "./constant";
import domo from "ryuu.js";
import { updateCollectionRequestType, updateCollectionResType } from "./types";

function* updateCollection(action: updateCollectionRequestType) {
  try {
    const document = action.payload;
    const response: updateCollectionResType = yield call(
      domo.put,
      `/domo/datastores/v1/collections/staffing_app_final/documents/${document?.documentId}`,
      {
        content: document,
      },
    );
    const data = response;
    yield put(updateCollectionSuccess(data));
  } catch (error) {
    yield put(updateCollectionFailure("Something went wrong on the update collection."));
  }
}

function* updateCollectionSaga() {
  yield takeEvery(UPDATE_COLLECTION_REQUEST, updateCollection);
}

export default updateCollectionSaga;
