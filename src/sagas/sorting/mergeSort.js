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
  setPause,
  afterSuccessSorting
} from "./sorting";

const SPEED_MULTIPLIER = 100;

// helper for start and watch for the process
function* mergeSortHelper() {
  const array = yield select(({ arraySettings }) => arraySettings.array);

  yield startSorting();

  // copy our array
  const mainArray = array.slice();
  const auxiliaryArray = array.slice();

  // race wich can stop the sorting
  const { success } = yield race({
    success: mergeSort(mainArray, auxiliaryArray, 0, array.length - 1),
    canceled: take('COMPARISON/RESET')
  });

  if(success) {
    yield afterSuccessSorting();
  }
}

function* mergeSort(
  mainArray,
  auxiliaryArray,
  startIdx,
  endIdx
) {
  if (startIdx === endIdx) return;

  // found the middle of arr
  const middleIdx = Math.floor((startIdx + endIdx) / 2);

  // recusriosn for the left side of arr
  yield mergeSort(auxiliaryArray, mainArray, startIdx, middleIdx);

  // recusriosn for the right side of arr
  yield mergeSort(auxiliaryArray, mainArray, middleIdx + 1, endIdx);

  // sort one part of arr
  yield sort(mainArray, auxiliaryArray, startIdx, middleIdx, endIdx);

  return true;
}

function* sort(
  mainArray,
  auxiliaryArray,
  startIdx,
  middleIdx,
  endIdx
) {

  // index in the mainArray
  let k = startIdx;

  // the left side
  let i = startIdx;

  // the right side
  let j = middleIdx + 1;

  // watch both parts at the time
  while (i <= middleIdx && j <= endIdx) {

    //active indexes - which are compared right now
    yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i,j] });
    yield setPause(SPEED_MULTIPLIER);

    // comparison
    // then increase indexes
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      yield setNewParams({ [k]: auxiliaryArray[i] });
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      yield setNewParams({ [k]: auxiliaryArray[j] });
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

  // if some elements didn't move
  // set them in the mainArray
  while (i <= middleIdx) {
    yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [i] });
    yield setPause(SPEED_MULTIPLIER);
    yield setNewParams({ [k]: auxiliaryArray[i] });
    mainArray[k++] = auxiliaryArray[i++];
  }

  while (j <= endIdx) {
    yield put({ type: 'COMPARISON/SET_ACTIVE_ELEMENTS', value: [j] });
    yield setPause(SPEED_MULTIPLIER);
    yield setNewParams({ [k]: auxiliaryArray[j] });
    mainArray[k++] = auxiliaryArray[j++];
  }
}

// run mergeSortHelper for SORTING/MERGE_SORT action
export default [
  takeLatest('SORTING/MERGE_SORT', mergeSortHelper),
];