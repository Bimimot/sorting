import { select, put, race, take, takeLatest } from "redux-saga/effects";

import {
  startSorting,
  setNewParams,
  setPause,
  afterSuccessSorting,
} from "./sorting";

const SPEED_MULTIPLIER = 100;

function* quickSortHelper() {
  const { array, arrayLength } = yield select(({ arraySettings }) => ({
    array: arraySettings.array,
    arrayLength: arraySettings.arrayLength,
  }));

  yield startSorting();

  // race can stop the sorting
  const { success } = yield race({
    success: quickSort(array, 0, arrayLength - 1),
    canceled: take("COMPARISON/RESET"),
  });

  if (success) {
    yield afterSuccessSorting();
  }
}

// swap helper
function* swap(items, firstIndex, secondIndex) {
  const params = {
    [firstIndex]: items[secondIndex],
    [secondIndex]: items[firstIndex],
  };

  let temp = items[firstIndex];
  items[firstIndex] = items[secondIndex];
  items[secondIndex] = temp;

  yield setNewParams(params);
  yield setPause(SPEED_MULTIPLIER);
}

// split array
function* partition(items, left, right, pivot) {
  // pivots, left and right
  let i = left;
  let j = right;

  while (i <= j) {
    // from left to right
    while (items[i] < pivot) {
      i++;
    }

    // from right to left
    while (items[j] > pivot) {
      j--;
    }

    // swap
    if (i <= j) {
      yield put({ type: "COMPARISON/SET_ACTIVE_ELEMENTS", value: [i, j] });
      yield setPause(SPEED_MULTIPLIER);
      yield swap(items, i, j);
      yield setPause(SPEED_MULTIPLIER);

      i++;
      j--;
    }
  }

  // return index, which split array
  return i;
}

// recursion
function* quickSort(items, left, right) {
  const pivotIndex = Math.floor((right + left) / 2);
  const pivot = items[pivotIndex];

  // color the pivot
  yield put({ type: "COMPARISON/SET_AUXILIARY_ELEMENTS", value: [pivotIndex] });

  // index, which split arr
  const index = yield partition(items, left, right, pivot);

  // recursion fot the left part
  if (left < index - 1) {
    yield quickSort(items, left, index - 1);
  }

  // recursion fot the right part
  if (index < right) {
    yield quickSort(items, index, right);
  }

  return items;
}

// start quickSortHelper 
export default [takeLatest("SORTING/QUICK_SORT", quickSortHelper)];
