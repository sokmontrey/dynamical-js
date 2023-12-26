export function pairIter(arr, callback, is_close_loop = true) {
  for (let i = 1; i < arr.length; i++) {
    callback(arr[i - 1], arr[i], i - 1, i);
  }
  if (is_close_loop) {
    const last_i = arr.length - 1;
    callback(arr[last_i], arr[0], last_i, 0);
  }
}

export function pairReduce(arr, callback, initialValue, is_close_loop = true) {
  let acc = initialValue;
  for (let i = 1; i < arr.length; i++) {
    acc = callback(acc, arr[i - 1], arr[i], i - 1, i);
  }
  if (is_close_loop) {
    const last_i = arr.length - 1;
    return callback(acc, arr[last_i], arr[0], last_i, 0);
  }
  return acc;
}
