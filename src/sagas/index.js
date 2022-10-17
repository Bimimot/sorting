import { all } from "redux-saga/effects";

import controls from "./controls";

export default function* rootSaga() {
  yield all([...controls]);
}
