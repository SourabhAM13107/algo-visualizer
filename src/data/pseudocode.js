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
};