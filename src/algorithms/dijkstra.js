export function recordDijkstra(graph, source) {
  const n = graph.nodes.length;
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b, w] of graph.edges) {
    adj[a].push([b, w]);
    adj[b].push([a, w]);
  }
  adj.forEach((list) => list.sort((x, y) => x[0] - y[0]));

  const dist = Array(n).fill(Infinity);
  const done = Array(n).fill(false);
  const prev = Array(n).fill(-1);
  dist[source] = 0;

  const steps = [];
  const snap = (type, extra = {}) =>
    steps.push({
      type,
      dist: [...dist],
      done: [...done],
      prev: [...prev],
      current: -1,
      from: -1,
      to: -1,
      weight: 0,
      candidate: 0,
      ...extra,
    });

  snap("start");

  while (true) {
    // pick the unfinished node with the smallest known distance
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!done[i] && dist[i] < Infinity && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1) break;

    done[u] = true;
    snap("visit", { current: u, node: u });

    for (const [v, w] of adj[u]) {
      if (done[v]) continue;
      const candidate = dist[u] + w;
      if (candidate < dist[v]) {
        dist[v] = candidate;
        prev[v] = u;
        snap("update", { current: u, from: u, to: v, weight: w, candidate });
      } else {
        snap("skip", { current: u, from: u, to: v, weight: w, candidate });
      }
    }
  }

  snap("done");
  return steps;
}