export const weightedGraph = {
  nodes: [
    { id: 0, x: 90,  y: 110 },
    { id: 1, x: 230, y: 50  },
    { id: 2, x: 230, y: 170 },
    { id: 3, x: 380, y: 50  },
    { id: 4, x: 380, y: 170 },
    { id: 5, x: 530, y: 110 },
  ],
  // [nodeA, nodeB, weight]  (undirected)
  edges: [
    [0, 1, 4],
    [0, 2, 1],
    [1, 2, 2],
    [1, 3, 5],
    [2, 4, 8],
    [3, 4, 2],
    [3, 5, 6],
    [4, 5, 3],
  ],
};