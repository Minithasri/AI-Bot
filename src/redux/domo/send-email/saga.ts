import { call, put, takeEvery } from "redux-saga/effects";
import { emailServiceSuccess, emailServiceFailure } from "./actions";
import { EMAIL_SERVICE_REQUEST } from "./constant";
import domo from "ryuu.js";
import { emailServiceRequestType, emailServiceResType } from "./types";

function* emailService(action: emailServiceRequestType) {
  try {
    const document = action.payload;
    const response: emailServiceResType = yield call(
      domo.post,
      "/domo/workflow/v1/models/mail_workflow/start",
      document,
    );
    const data = response;
    yield put(emailServiceSuccess(data));
  } catch (error) {
    yield put(emailServiceFailure("Something went wrong on the create collection."));
  }
}

function* emailServiceSaga() {
  yield takeEvery(EMAIL_SERVICE_REQUEST, emailService);
}

export default emailServiceSaga;
