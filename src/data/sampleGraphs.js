export const sampleGraph = {
  // each node's id must equal its index in this array
  nodes: [
    { id: 0, x: 90,  y: 110 },
    { id: 1, x: 230, y: 50  },
    { id: 2, x: 230, y: 170 },
    { id: 3, x: 380, y: 50  },
    { id: 4, x: 380, y: 170 },
    { id: 5, x: 530, y: 110 },
  ],
  // adjacency list: who is connected to whom
  adj: {
    0: [1, 2],
    1: [0, 3],
    2: [0, 4],
    3: [1, 5],
    4: [2, 5],
    5: [3, 4],
  },
};