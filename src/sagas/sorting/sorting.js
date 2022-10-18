import { delay, put, select } from "redux-saga/effects";

// change elements 
export function* setNewParams(params) {
  const array = yield select(({ arraySettings }) => arraySettings.array);

  for (let index in params) {
    array[index] = params[index];
  }

  yield put({ type: "ARRAY/SET_ARRAY", value: array });
}

// pause for animation
export function* setPause(multiplier = 100) {
  const sortingSpeed = yield select(
    ({ comparison }) => comparison.sortingSpeed
  );

  // delay depends on sortingSpeed and multiplier param
  yield delay(multiplier / sortingSpeed);
}

export function* startSorting() {
  // when we start we set initialState 
  yield put({ type: "COMPARISON/RESET" });
  yield put({ type: "COMPARISON/TOGGLE_SORT", value: true });
}

export function* afterSuccessSorting() {
  const sortedArrayLength = yield select(
    ({ arraySettings }) => arraySettings.arrayLength
  );

  yield put({ type: "COMPARISON/RESET" });

  // the loop in the array
  for (let length = 1; length <= sortedArrayLength; length++) {
    // mark all elements like 'sorted'
    yield put({
      type: "COMPARISON/SET_SORTED_ELEMENTS",
      value: Array.from(Array(length).keys()),
    });

    // min animation pause
    yield setPause(1);
  }
}
