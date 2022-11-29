import {
  select,
  put,
  race,
  take,
  takeLatest
} from 'redux-saga/effects';

import {
    startSorting,
    setNewParams,
    setPause
} from "./sorting";

const SPEED_MULTIPLIER = 60;

function* shakerSortHelper() {
  const { array, arrayLength } = yield select(({ arraySettings }) => ({
    array: arraySettings.array,
    arrayLength: arraySettings.arrayLength
  }));

  yield startSorting();

  // race can stop the sorting
  const { success } = yield race({
    success: shakerSort(array, arrayLength),
    canceled: take('COMPARISON/RESET')
  });

  if(success) {
    yield put({ type: 'COMPARISON/TOGGLE_SORT', value: false });
  }
}

// swap helper
function* swap(array, i, j) {
  const params = {
    [i]: array[j],
    [j]: array[i]
  };

  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;

  yield setNewParams(params);
  yield setPause(SPEED_MULTIPLIER);
}

// main sorting alghoritm
function* shakerSort(array, arrayLength) {

  let completedElements = [];

  // first and last indexes
  let left = 0;
  let right = arrayLength - 1;

  // additional indexes for optimization
  // from begining it the extrem elements, then
  // last swaped elements
  let leftSwap = 0;
  let rightSwap = arrayLength - 1;

  while (left < right) {
    for (let i = left; i < right; i++) {

      // set active indexes,
      yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i, i + 1] });
      yield setPause(SPEED_MULTIPLIER);

      if (array[i] > array[i + 1]) {
        yield swap(array, i, i + 1);

        // remember last rightSwap index
        rightSwap = i;
      }
    }

    // if no swap, sorting is done
    if(rightSwap === right) {
      completedElements = Array.from(Array(arrayLength).keys());

      yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: completedElements });

      return true;
    }

    // go from right to left side
    // all elements after rightSwap are sorted
    right = rightSwap;

    // all elements before left and after right pivot are sorted
    completedElements = [...Array.from(Array(left).keys()), ...Array.from(Array(arrayLength).keys()).splice(right + 1)];

    yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: completedElements });

    // repeat, go to the left side
    for (let i = right; i > left; i--) {
      yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i - 1, i] });
      yield setPause(SPEED_MULTIPLIER);

      if (array[i] < array[i - 1]) {
        yield swap(array, i, i - 1);

        // remember
        leftSwap = i;
      }
    }

    // go to right  side
    // all elements before leftSwap are sorted
    left = leftSwap;

    // all elements before left pivot and after right pivot are sorted
    completedElements = [...Array.from(Array(left).keys()), ...Array.from(Array(arrayLength).keys()).splice(right + 1)];

    yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: completedElements });
  }

  // sorting is done
  yield put({ type: 'COMPARISON/SET_SORTED_ELEMENTS', value: Array.from(Array(arrayLength).keys()) });

  return true;
}

// start shakerSortHelper
export default [
  takeLatest('SORTING/SHAKER_SORT', shakerSortHelper),
];