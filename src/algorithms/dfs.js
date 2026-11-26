export function recordDFS(graph, start) {
  const steps = [];
  const visited = new Set();
  const stack = [start];

  steps.push({ type: "start", node: start, queue: [...stack], visited: [] });

  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    steps.push({ type: "visit", node, queue: [...stack], visited: [...visited] });

    for (const neighbor of [...graph[node]].reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        steps.push({ type: "enqueue", node: neighbor, from: node, queue: [...stack], visited: [...visited] });
      }
    }
  }
  return steps;
}