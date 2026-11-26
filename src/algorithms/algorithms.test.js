import { describe, it, expect } from "vitest";
import { recordBFS } from "./bfs.js";
import { recordDFS } from "./dfs.js";
import { recordDijkstra } from "./dijkstra.js";
import { recordBubbleSort } from "./bubbleSort.js";
import { recordInsertionSort } from "./insertionSort.js";
import { recordMergeSort } from "./mergeSort.js";
import { recordQuickSort } from "./quickSort.js";
import { recordBinarySearch } from "./binarySearch.js";
import { sampleGraph } from "../data/sampleGraphs.js";
import { weightedGraph } from "../data/weightedGraph.js";

const visitOrder = (steps) => steps.filter((s) => s.type === "visit").map((s) => s.node);
const last = (steps) => steps[steps.length - 1];
const ascending = (arr) => [...arr].sort((a, b) => a - b);
const operations = (steps) =>
  steps.filter((s) => ["compare", "swap", "place", "copy"].includes(s.type)).length;

describe("graph traversal", () => {
  it("BFS visits nodes level by level", () => {
    const steps = recordBFS(sampleGraph.adj, 0);
    expect(visitOrder(steps)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("BFS keeps independent snapshots of the queue", () => {
    const steps = recordBFS(sampleGraph.adj, 0);
    expect(steps[0].queue).toEqual([0]);
    expect(steps[0].visited).toEqual([0]);
  });

  it("DFS goes deep before wide", () => {
    const steps = recordDFS(sampleGraph.adj, 0);
    expect(visitOrder(steps)).toEqual([0, 1, 3, 5, 4, 2]);
  });
});

describe("Dijkstra", () => {
  const steps = recordDijkstra(weightedGraph, 0);

  it("finishes nodes in order of distance", () => {
    expect(visitOrder(steps)).toEqual([0, 2, 1, 3, 4, 5]);
  });

  it("computes the shortest distances", () => {
    expect(last(steps).dist).toEqual([0, 3, 1, 8, 9, 12]);
  });

  it("improves node 1 from 4 to 3 through node 2", () => {
    const update = steps.find((s) => s.type === "update" && s.to === 1 && s.candidate === 3);
    expect(update).toBeDefined();
  });
});

describe("sorting algorithms", () => {
  const sorters = {
    bubble: recordBubbleSort,
    insertion: recordInsertionSort,
    merge: recordMergeSort,
    quick: recordQuickSort,
  };

  const fixed = [
    [5, 2, 8, 1, 9, 3],
    [2, 1],
    [1, 2, 3, 4],
    [9, 7, 5, 3, 1],
    [3, 3, 1, 2, 2],
    [4],
  ];

  for (const [name, record] of Object.entries(sorters)) {
    it(`${name} sort sorts fixed inputs`, () => {
      for (const input of fixed) {
        expect(last(record(input)).array).toEqual(ascending(input));
      }
    });

    it(`${name} sort sorts 50 random inputs`, () => {
      for (let t = 0; t < 50; t++) {
        const n = 2 + Math.floor(Math.random() * 11);
        const input = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 20));
        expect(last(record(input)).array).toEqual(ascending(input));
      }
    });

    it(`${name} sort does not change the original array`, () => {
      const input = [5, 2, 8, 1, 9, 3];
      const copy = [...input];
      record(input);
      expect(input).toEqual(copy);
    });
  }

  it("merge sort needs far fewer operations than bubble sort on 30 reversed items", () => {
    const input = Array.from({ length: 30 }, (_, i) => 30 - i);
    const bubble = operations(recordBubbleSort(input));
    const merge = operations(recordMergeSort(input));
    expect(merge).toBeLessThan(bubble / 2);
  });
});

describe("binary search", () => {
  it("finds a value that exists", () => {
    const steps = recordBinarySearch([5, 2, 8, 1, 9, 3], 9);
    const end = last(steps);
    expect(end.type).toBe("found");
    expect(end.array[end.mid]).toBe(9);
  });

  it("reports a value that does not exist", () => {
    const steps = recordBinarySearch([5, 2, 8, 1, 9, 3], 4);
    expect(last(steps).type).toBe("notfound");
  });

  it("sorts the input before searching", () => {
    const steps = recordBinarySearch([5, 2, 8, 1, 9, 3], 5);
    expect(steps[0].array).toEqual([1, 2, 3, 5, 8, 9]);
  });
});