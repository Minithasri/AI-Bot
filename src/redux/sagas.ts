import { all } from "redux-saga/effects";

import authSaga from "./auth/saga";
import userCheckSaga from "./domo/profile/saga";
import createCollectionSaga from "./domo/rostering/createCollection/saga";
import listCollectionSaga from "./domo/rostering/listCollection/saga";
import updateCollectionSaga from "./domo/rostering/updateCollection/saga";
import deleteCollectionSaga from "./domo/rostering/deleteCollection/saga";
import staffReqmtListSaga from "./domo/staff-data/saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    userCheckSaga(),
    createCollectionSaga(),
    listCollectionSaga(),
    staffReqmtListSaga(),
    updateCollectionSaga(),
    deleteCollectionSaga(),
  ]);
}
