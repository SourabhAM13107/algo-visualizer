export function recordQuickSort(input) {
  const arr = [...input];
  const n = arr.length;
  const sorted = new Array(n).fill(false);
  const steps = [];

  const snap = (type, extra = {}) =>
    steps.push({
      type,
      array: [...arr],
      sorted: [...sorted],
      lo: -1,
      hi: -1,
      i: -1,
      j: -1,
      ...extra,
    });

  snap("start");

  function sort(lo, hi) {
    if (lo > hi) return;
    if (lo === hi) {
      sorted[lo] = true; // a single element is already in place
      return;
    }

    const pivot = arr[hi]; // last element is the pivot
    let i = lo - 1; // end of the "<= pivot" zone
    snap("pivot", { lo, hi, i, j: lo });

    for (let j = lo; j < hi; j++) {
      snap("compare", { lo, hi, i, j });
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        snap("swap", { lo, hi, i, j });
      }
    }

    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    sorted[i + 1] = true;
    snap("place", { lo, hi, i: i + 1, j: hi });

    sort(lo, i);
    sort(i + 2, hi);
  }

  sort(0, n - 1);
  sorted.fill(true);
  snap("done");
  return steps;
}