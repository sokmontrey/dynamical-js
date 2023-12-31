export default class DynArray {
  static pairIter(arr, callback, skip = 0) {
    for (let i = 0; i < arr.length; i++) {
      const next_i = (i + skip + 1) % arr.length;
      callback(arr[i], arr[next_i], i, next_i);
    }
  }

  static pairReduce(arr, callback, initialValue, skip = 0) {
    let acc = initialValue;
    for (let i = 0; i < arr.length; i++) {
      const next_i = (i + skip + 1) % arr.length;
      acc = callback(acc, arr[i], arr[next_i], i, next_i);
    }
    return acc;
  }
}
