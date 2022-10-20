import { put, select, takeLatest } from "redux-saga/effects";

import { createArray } from "../helpers";

function* resetArray() {
  const arrayLength = yield select(
    ({ arraySettings }) => arraySettings.arrayLength
  );

  yield put({ type: "ARRAY/SET_ARRAY", value: createArray(arrayLength) });
};

function* setArrayLength({ value }) {
  yield put({ type: 'ARRAY/SET_LENGTH', value })
  yield resetArray();
}

export default [
  takeLatest('CONTROLS/RESET_ARRAY', resetArray),
  takeLatest('CONTROLS/SET_ARRAY_LENGTH', setArrayLength)
];