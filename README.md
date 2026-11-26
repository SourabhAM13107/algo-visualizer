# Algorithm Visualizer

An interactive website that shows algorithms running step by step, lets you test yourself with a **"Predict the Next Step"** quiz, and races two sorting algorithms against each other on the same input.

**Live demo:** https://algo-visualizer-eosin.vercel.app

![Merge sort running](docs/watch.png)

## Features

- **Watch mode:** Play, Pause, Prev, Next, Reset and a speed slider.
- **Predict the Next Step:** the visualization pauses and asks what the algorithm will do next (click a node, Swap or Don't swap, Left or Right, Go left or Go right). Your score is tracked.
- **Algorithm Race:** two sorting algorithms sort the identical array side by side, with live counters for comparisons and moves and a winner at the end. Try 30 reversed items to see O(n²) lose to O(n log n).
- **Live pseudocode:** the lines being executed are highlighted as the algorithm runs.
- **Complexity panel:** best, average, worst and space complexity for every algorithm.
- **Custom input:** type your own array (or press Random) and set your own search target.
- **Dark mode,** remembered between visits, and a layout that works on phones.

![Predict the next step quiz](docs/predict.png)

![Algorithm race](docs/race.png)

## Algorithms

| Category | Algorithms |
|---|---|
| Graph traversal | BFS, DFS |
| Shortest path | Dijkstra (weighted graph) |
| Sorting | Bubble Sort, Insertion Sort, Merge Sort, Quick Sort |
| Searching | Binary Search |

## How it works

Every algorithm is written as a **step recorder**: instead of just returning the answer, it runs once and saves a snapshot after every important action (visiting a node, comparing two bars, updating a distance).

```js
[
  { type: "visit", node: 0, queue: [1, 2], visited: [0] },
  { type: "enqueue", node: 1, from: 0, queue: [1, 2], visited: [0, 1] },
  ...
]
```

The user interface only replays this list of steps. That design has four benefits:

1. **Logic and drawing are separate.** The algorithm files contain no React code, so adding an algorithm means adding one recorder file, a pseudocode entry and one dropdown entry.
2. **Stepping backwards is free.** Prev just moves the index back.
3. **The quiz is simple.** At step `i`, the correct answer is already stored in step `i + 1`.
4. **The race is fair.** Both algorithms are recorded on the same input and replayed one operation per tick, so the counters measure the work each one really does.

## Tests

The recorders are covered by unit tests (Vitest): traversal order for BFS and DFS, shortest distances for Dijkstra, that every sorting algorithm sorts fixed and random inputs without changing the original array, and binary search found and not-found cases.

```bash
npm test
```

## Tech stack

- React and Vite
- HTML Canvas for the graphs, plain CSS with theme variables for the layout and dark mode
- Vitest for tests
- Deployed on Vercel

## Run it locally

```bash
git clone https://github.com/SourabhAM13107/algo-visualizer.git
cd algo-visualizer
npm install
npm run dev
```

Then open the link printed in the terminal (usually http://localhost:5173).

## Project structure

```
src/
  algorithms/   step recorders and their tests
  components/   drawing components, race, pseudocode and complexity panels
  data/         sample graphs, pseudocode text, complexity table
  hooks/        usePlayer (play, pause, step, speed)
  App.jsx       visualizer page and quiz logic
  Home.jsx      navigation, theme toggle and page switching
```

## Planned

- Prim, Kruskal and Bellman-Ford
- Dynamic programming visualizations (knapsack, LCS)
- Editable graphs (add and drag nodes and edges)
- Saved quiz scores and a leaderboard