import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

// reducers
import Layout from "./layout/reducers";
import Auth from "./auth/reducers";

// saga
import rootSaga from "./sagas";
import { profileReducer } from "./domo/profile/reducer";
import { createCollectionReducer } from "./domo/rostering/createCollection/reducer";
import { listCollectionReducer } from "./domo/rostering/listCollection/reducer";
import { updateCollectionReducer } from "./domo/rostering/updateCollection/reducer";
import { deleteCollectionReducer } from "./domo/rostering/deleteCollection/reducer";
import { staffReqmtListReducer } from "./domo/staff-data/reducer";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// mount it on the store
export const store = configureStore({
  reducer: {
    Auth: Auth,
    Layout: Layout,
    profile: profileReducer,
    createCollection: createCollectionReducer,
    listCollection: listCollectionReducer,
    staffReqmtList: staffReqmtListReducer,
    updateCollection: updateCollectionReducer,
    deleteCollection: deleteCollectionReducer,
  } as any,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(middleware),
});

// run the saga
sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
