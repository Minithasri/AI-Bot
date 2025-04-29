import { call, put, takeEvery } from "redux-saga/effects";
import { deleteCollectionSuccess, deleteCollectionFailure } from "./actions";
import { DELETE_COLLECTION_REQUEST } from "./constant";
import domo from "ryuu.js";
import { deleteCollectionRequestType } from "./types";

function* deleteCollection(action: deleteCollectionRequestType) {
  try {
    const { documentId } = action.payload;
    yield call(
      domo.delete,
      `/domo/datastores/v1/collections/staffing_app_final/documents/${documentId}`,
    );
    yield put(deleteCollectionSuccess());
  } catch (error) {
    yield put(deleteCollectionFailure("Something went wrong on the delete collection."));
  }
}

function* deleteCollectionSaga() {
  yield takeEvery(DELETE_COLLECTION_REQUEST, deleteCollection);
}

export default deleteCollectionSaga;
