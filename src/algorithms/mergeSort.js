export function recordMergeSort(input) {
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
      leftStart: -1,
      leftEnd: -1,
      i: -1,
      j: -1,
      pos: -1,
      side: null,
      ...extra,
    });

  snap("start");

  function sort(lo, hi) {
    if (lo >= hi) {
      sorted[lo] = true; // a single element is already sorted
      return;
    }
    const mid = Math.floor((lo + hi) / 2);
    snap("split", { lo, hi, leftStart: lo, leftEnd: mid });
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  function merge(lo, mid, hi) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    const merged = [];
    let a = 0;
    let b = 0;

    // the bars show: merged so far, then the left leftovers, then the right leftovers
    const show = () => {
      const view = [...merged, ...left.slice(a), ...right.slice(b)];
      for (let t = 0; t < view.length; t++) arr[lo + t] = view[t];
    };

    const place = (type, side) => {
      show();
      const leftStart = lo + merged.length;
      const leftEnd = leftStart + (left.length - a) - 1;
      snap(type, { lo, hi, leftStart, leftEnd, pos: lo + merged.length - 1, side });
    };

    while (a < left.length && b < right.length) {
      const k = lo + merged.length;
      const ln = left.length - a;
      snap("compare", { lo, hi, leftStart: k, leftEnd: k + ln - 1, i: k, j: k + ln });

      if (left[a] <= right[b]) {
        merged.push(left[a]);
        a++;
        place("place", "left");
      } else {
        merged.push(right[b]);
        b++;
        place("place", "right");
      }
    }

    while (a < left.length) {
      merged.push(left[a]);
      a++;
      place("copy", "left");
    }
    while (b < right.length) {
      merged.push(right[b]);
      b++;
      place("copy", "right");
    }

    for (let t = lo; t <= hi; t++) sorted[t] = true;
    snap("merged", { lo, hi, leftStart: hi + 1, leftEnd: hi });
  }

  sort(0, n - 1);
  snap("done");
  return steps;
}