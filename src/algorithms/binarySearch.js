export function recordBinarySearch(input, target) {
  const arr = [...input].sort((a, b) => a - b); // binary search needs sorted data
  const steps = [];
  let low = 0;
  let high = arr.length - 1;

  steps.push({ type: "start", array: arr, low, high, mid: -1, target });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ type: "check", array: arr, low, high, mid, target });

    if (arr[mid] === target) {
      steps.push({ type: "found", array: arr, low, high, mid, target });
      return steps;
    }

    if (arr[mid] < target) {
      low = mid + 1;
      steps.push({ type: "go-right", array: arr, low, high, mid, target });
    } else {
      high = mid - 1;
      steps.push({ type: "go-left", array: arr, low, high, mid, target });
    }
  }

  steps.push({ type: "notfound", array: arr, low, high, mid: -1, target });
  return steps;
}