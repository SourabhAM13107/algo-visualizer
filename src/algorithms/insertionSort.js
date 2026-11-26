export function recordInsertionSort(input) {
  const arr = [...input];
  const steps = [];

  steps.push({ type: "start", array: [...arr], i: -1, j: -1, sortedCount: 0 });

  for (let k = 1; k < arr.length; k++) {
    for (let j = k; j > 0; j--) {
      steps.push({ type: "compare", array: [...arr], i: j - 1, j, sortedCount: 0 });

      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        steps.push({ type: "swap", array: [...arr], i: j - 1, j, sortedCount: 0 });
      } else {
        break; // this element is already in its place
      }
    }
  }

  steps.push({ type: "done", array: [...arr], i: -1, j: -1, sortedCount: arr.length });
  return steps;
}