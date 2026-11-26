export function recordBFS(graph, start) {
  const steps = [];
  const visited = new Set([start]);
  const queue = [start];

  steps.push({ type: "start", node: start, queue: [...queue], visited: [...visited] });

  while (queue.length > 0) {
    const node = queue.shift();
    steps.push({ type: "visit", node, queue: [...queue], visited: [...visited] });

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({ type: "enqueue", node: neighbor, from: node, queue: [...queue], visited: [...visited] });
      }
    }
  }
  return steps;
}