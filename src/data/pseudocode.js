export const PSEUDOCODE = {
  BFS: {
    lines: [
      "BFS(graph, start):",
      "  mark start as discovered; queue.push(start)",
      "  while queue is not empty:",
      "    node = queue.popFront()",
      "    visit(node)",
      "    for each neighbor of node:",
      "      if neighbor is not discovered:",
      "        mark it discovered; queue.push(neighbor)",
    ],
    highlight: { start: [1], visit: [3, 4], enqueue: [6, 7] },
  },
  DFS: {
    lines: [
      "DFS(graph, start):",
      "  stack.push(start)",
      "  while stack is not empty:",
      "    node = stack.pop()",
      "    if node already visited: continue",
      "    mark node visited; visit(node)",
      "    for each neighbor of node:",
      "      if neighbor is not visited:",
      "        stack.push(neighbor)",
    ],
    highlight: { start: [1], visit: [3, 4, 5], enqueue: [7, 8] },
  },
  BUBBLE: {
    lines: [
      "bubbleSort(arr):",
      "  for pass = 0 to n - 2:",
      "    for j = 0 to n - 2 - pass:",
      "      compare arr[j] and arr[j + 1]",
      "      if arr[j] > arr[j + 1]:",
      "        swap arr[j], arr[j + 1]",
      "    // largest value of this pass is now in place",
      "  done: array is sorted",
    ],
    highlight: { start: [0], compare: [2, 3, 4], swap: [5], done: [7] },
  },

    INSERTION: {
    lines: [
      "insertionSort(arr):",
      "  for k = 1 to n - 1:",
      "    for j = k down to 1:",
      "      compare arr[j - 1] and arr[j]",
      "      if arr[j - 1] > arr[j]:",
      "        swap arr[j - 1], arr[j]",
      "      else: break   // element is in place",
      "  done: array is sorted",
    ],
    highlight: { start: [0], compare: [2, 3, 4], swap: [5], done: [7] },
  },

    BINARY: {
    lines: [
      "binarySearch(arr, target):   // arr is sorted",
      "  low = 0; high = n - 1",
      "  while low <= high:",
      "    mid = floor((low + high) / 2)",
      "    if arr[mid] == target: return mid",
      "    else if arr[mid] < target: low = mid + 1",
      "    else: high = mid - 1",
      "  return not found",
    ],
    highlight: {
      start: [1],
      check: [3, 4],
      found: [4],
      "go-right": [5],
      "go-left": [6],
      notfound: [7],
    },
  },

    MERGE: {
    lines: [
      "mergeSort(arr, lo, hi):",
      "  if lo >= hi: return",
      "  mid = floor((lo + hi) / 2)",
      "  mergeSort(arr, lo, mid)",
      "  mergeSort(arr, mid + 1, hi)",
      "  merge(arr, lo, mid, hi)",
      "",
      "merge(arr, lo, mid, hi):",
      "  while both halves still have elements:",
      "    compare the left head and the right head",
      "    move the smaller one to the output",
      "  copy the leftovers of the other half",
    ],
    highlight: {
      start: [0],
      split: [1, 2, 3, 4],
      compare: [8, 9],
      place: [10],
      copy: [11],
      merged: [5],
      done: [5],
    },
  },
};

