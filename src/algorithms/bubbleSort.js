export function recordBubbleSort(input) {
  const arr = [...input];
  const steps = [];
  const sortedFrom = () => arr.length; // placeholder, updated below
  let sortedCount = 0;

  steps.push({ type: "start", array: [...arr], i: -1, j: -1, sortedCount });

  for (let pass = 0; pass < arr.length - 1; pass++) {
    for (let j = 0; j < arr.length - 1 - pass; j++) {
      steps.push({ type: "compare", array: [...arr], i: j, j: j + 1, sortedCount });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ type: "swap", array: [...arr], i: j, j: j + 1, sortedCount });
      }
    }
    sortedCount++; // the largest value of this pass is now in its final place
  }

  steps.push({ type: "done", array: [...arr], i: -1, j: -1, sortedCount: arr.length });
  return steps;
}