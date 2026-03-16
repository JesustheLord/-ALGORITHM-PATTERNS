/**
 * ============================================================
 *  06 - GRAPH & TREE TRAVERSALS (Recursion Heavy)
 * ============================================================
 *  Trees are special graphs (connected, no cycles).
 *  Both rely heavily on recursion for traversal.
 *
 *  Graph representations:
 *    - Adjacency List  { a: [b,c], b: [a,d] }
 *    - Adjacency Matrix  grid[i][j] = 1 if edge exists
 *
 *  Key traversals:
 *    DFS (Depth-First Search) — uses stack / recursion
 *    BFS (Breadth-First Search) — uses queue
 * ============================================================
 */

// ─────────────────────────────────────────────
// TREE NODE HELPER
// ─────────────────────────────────────────────
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Build a sample tree:
//         1
//        / \
//       2   3
//      / \   \
//     4   5   6
const sampleTree = new TreeNode(1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3, null, new TreeNode(6))
);

// ─────────────────────────────────────────────
// 1. TREE TRAVERSALS (In-order, Pre-order, Post-order)
// ─────────────────────────────────────────────
// Real-world: Expression evaluation, file system walk, DOM traversal

function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.val);
  return result;
}

console.log("Tree Traversals:");
console.log("  Inorder:  ", inorder(sampleTree));    // [4,2,5,1,3,6]
console.log("  Preorder: ", preorder(sampleTree));   // [1,2,4,5,3,6]
console.log("  Postorder:", postorder(sampleTree));  // [4,5,2,6,3,1]

// ─────────────────────────────────────────────
// 2. LEVEL ORDER TRAVERSAL (BFS)
// ─────────────────────────────────────────────
// Real-world: Social network degrees, shortest path (unweighted), web crawling
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
console.log("\nLevel Order:", levelOrder(sampleTree));
// [[1], [2,3], [4,5,6]]

// ─────────────────────────────────────────────
// 3. MAX DEPTH OF BINARY TREE
// ─────────────────────────────────────────────
// Real-world: DOM depth analysis, file system depth, org chart depth
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
console.log("Max Depth:", maxDepth(sampleTree)); // 3

// ─────────────────────────────────────────────
// 4. CHECK IF TREE IS BALANCED
// ─────────────────────────────────────────────
// Real-world: Database B-tree balancing, AVL trees, load balancing verification
function isBalanced(root) {
  function height(node) {
    if (!node) return 0;
    const leftH = height(node.left);
    const rightH = height(node.right);
    if (leftH === -1 || rightH === -1 || Math.abs(leftH - rightH) > 1) return -1;
    return 1 + Math.max(leftH, rightH);
  }
  return height(root) !== -1;
}
console.log("Is Balanced?", isBalanced(sampleTree)); // true

// ─────────────────────────────────────────────
// 5. LOWEST COMMON ANCESTOR (LCA)
// ─────────────────────────────────────────────
// Real-world: Version control merge base, org chart queries, taxonomy
function lowestCommonAncestor(root, p, q) {
  if (!root || root.val === p || root.val === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  if (left && right) return root;    // p & q on different sides → root is LCA
  return left || right;
}

const lca = lowestCommonAncestor(sampleTree, 4, 5);
console.log("LCA of 4 and 5:", lca ? lca.val : null); // 2

// ─────────────────────────────────────────────
// 6. GRAPH DFS (Depth-First Search)
// ─────────────────────────────────────────────
// Real-world: Maze solving, topological sort, cycle detection, social network analysis
function graphDFS(graph, start) {
  const visited = new Set();
  const order = [];

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);
    for (const neighbor of (graph[node] || [])) {
      dfs(neighbor);
    }
  }

  dfs(start);
  return order;
}

const graph = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: [],
};
console.log("\nGraph DFS from A:", graphDFS(graph, "A"));
// [A, B, D, E, F, C]

// ─────────────────────────────────────────────
// 7. GRAPH BFS (Breadth-First Search)
// ─────────────────────────────────────────────
// Real-world: Shortest path (unweighted), web crawling, network broadcasting
function graphBFS(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}
console.log("Graph BFS from A:", graphBFS(graph, "A"));
// [A, B, C, D, E, F]

// ─────────────────────────────────────────────
// 8. DETECT CYCLE IN DIRECTED GRAPH
// ─────────────────────────────────────────────
// Real-world: Dependency resolution (npm, webpack), deadlock detection
function hasCycle(graph) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};

  for (const node of Object.keys(graph)) {
    color[node] = WHITE;
  }

  function dfs(node) {
    color[node] = GRAY;                         // being processed
    for (const neighbor of (graph[node] || [])) {
      if (color[neighbor] === GRAY) return true;  // back edge → cycle!
      if (color[neighbor] === WHITE && dfs(neighbor)) return true;
    }
    color[node] = BLACK;                         // fully processed
    return false;
  }

  for (const node of Object.keys(graph)) {
    if (color[node] === WHITE && dfs(node)) return true;
  }
  return false;
}

console.log("\nHas cycle (DAG)?", hasCycle(graph)); // false
console.log("Has cycle (with cycle)?", hasCycle({
  A: ["B"], B: ["C"], C: ["A"]                    // A→B→C→A cycle
})); // true

// ─────────────────────────────────────────────
// 9. TOPOLOGICAL SORT (DFS-based)
// ─────────────────────────────────────────────
// Real-world: Build systems (Make, Gradle), course prerequisite ordering, task scheduling
function topologicalSort(graph) {
  const visited = new Set();
  const stack = [];

  function dfs(node) {
    visited.add(node);
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }
    stack.push(node);   // push AFTER all descendants
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) dfs(node);
  }
  return stack.reverse();
}

const courseGraph = {
  "Math":    ["Physics"],
  "Physics": ["Engineering"],
  "English": [],
  "Engineering": [],
  "CS":      ["Math", "English"],
};
console.log("\nTopological Sort (course order):");
console.log(topologicalSort(courseGraph));

// ─────────────────────────────────────────────
// 10. SHORTEST PATH — DIJKSTRA'S ALGORITHM
// ─────────────────────────────────────────────
// Real-world: GPS navigation, network routing (OSPF), game AI pathfinding
function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  }
  distances[start] = 0;

  while (unvisited.size) {
    // Pick unvisited node with smallest distance (simple version)
    let current = null;
    for (const node of unvisited) {
      if (!current || distances[node] < distances[current]) {
        current = node;
      }
    }

    unvisited.delete(current);

    for (const { node: neighbor, weight } of (graph[current] || [])) {
      const alt = distances[current] + weight;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
      }
    }
  }

  // Reconstruct paths
  function getPath(target) {
    const path = [];
    let current = target;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
    return path;
  }

  return { distances, getPath };
}

const weightedGraph = {
  A: [{ node: "B", weight: 4 }, { node: "C", weight: 2 }],
  B: [{ node: "D", weight: 3 }, { node: "C", weight: 1 }],
  C: [{ node: "B", weight: 1 }, { node: "D", weight: 5 }],
  D: [],
};
const { distances, getPath } = dijkstra(weightedGraph, "A");
console.log("\nDijkstra from A:");
console.log("  Distances:", distances);          // { A: 0, B: 3, C: 2, D: 6 }
console.log("  Path to D:", getPath("D"));       // [A, C, B, D]

// ─────────────────────────────────────────────
// 11. NUMBER OF ISLANDS (DFS on Grid)
// ─────────────────────────────────────────────
// Real-world: Image segmentation, connected component analysis, terrain mapping
function numIslands(grid) {
  if (!grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === "0") return;
    grid[r][c] = "0";    // mark visited
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}

const islandGrid = [
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"],
];
console.log("\nNumber of Islands:", numIslands(islandGrid)); // 3

module.exports = {
  TreeNode, inorder, preorder, postorder, levelOrder,
  maxDepth, isBalanced, lowestCommonAncestor,
  graphDFS, graphBFS, hasCycle, topologicalSort,
  dijkstra, numIslands,
};
