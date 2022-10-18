import { select, put, race, take, takeLatest } from "redux-saga/effects";

import { startSorting, setNewParams, setPause } from "./sorting";

const SPEED_MULTIPLIER = 80;

// helper for start
// is watching for result
function* bubbleSortHelper() {
  const { array, arrayLength } = yield select(({ arraySettings }) => ({
    array: arraySettings.array,
    arrayLength: arraySettings.arrayLength,
  }));

  yield startSorting();

  // race for canceling
  const { success } = yield race({
    success: bubbleSort(array, arrayLength),
    canceled: take("COMPARISON/RESET"),
  });

  // finish for succesful case
  if (success) {
    yield put({ type: "COMPARISON/TOGGLE_SORT", value: false });
  }
}

// the main function
function* bubbleSort(array, arrayLength) {
  // array of indexes for sorted elements
  const completedElements = [];

  for (let step = 0; step < arrayLength - 1; step++) {
    for (
      let compareIndex = 0;
      compareIndex < arrayLength - 1 - step;
      compareIndex++
    ) {
      // active elements = compared elements,
      // которые сравниваются между собой в данный момент
      yield put({
        type: "COMPARISON/SET_ACTIVE_ELEMENTS",
        value: [compareIndex, compareIndex + 1],
      });

      // animation pause
      yield setPause(SPEED_MULTIPLIER);

      const left = array[compareIndex];
      const right = array[compareIndex + 1];

      if (left > right) {
        const params = {
          [compareIndex]: right,
          [compareIndex + 1]: left,
        };

        //change current array from params
        array[compareIndex] = right;
        array[compareIndex + 1] = left;

        // change array in the redux-store
        yield setNewParams(params);

        // animation pause
        yield setPause(SPEED_MULTIPLIER);
      }
    }

    // after the last comparison add the element in the completedElements   
    completedElements.push(arrayLength - 1 - step);

    // add sorted indexes in the redux-store
    yield put({
      type: "COMPARISON/SET_SORTED_ELEMENTS",
      value: completedElements,
    });
  }

  // at the end of the loop add zero alement to completedElements
  yield put({
    type: "COMPARISON/SET_SORTED_ELEMENTS",
    value: [0, ...completedElements],
  });

  // return true for marking the susccesful end of the loop
  return true;
}

// start bubbleSortHelper when SORTING/BUBBLE_SORT was sent
export default [takeLatest("SORTING/BUBBLE_SORT", bubbleSortHelper)];
