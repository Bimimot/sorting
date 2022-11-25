import { all } from "redux-saga/effects";

import controls from "./controls";
import bubbleSort from "./sorting/bubbleSort";
import mergeSort from "./sorting/mergeSort";
import shakeSort from "./sorting/shakeSort";


export default function* rootSaga() {
  yield all([
    ...controls,
    ...bubbleSort,
    ...mergeSort,
    ...shakeSort
  ]);
}
