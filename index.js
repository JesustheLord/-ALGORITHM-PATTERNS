/**
 * ============================================================
 *  ALGORITHM PATTERNS — MASTER INDEX
 * ============================================================
 *  Run individual files:
 *    node 01-recursion-basics.js
 *    node 02-backtracking.js
 *    node 03-divide-and-conquer.js
 *    node 04-dynamic-programming.js
 *    node 05-greedy-algorithms.js
 *    node 06-graphs-and-trees.js
 *    node 07-real-world-patterns.js
 *
 *  Or run this file to execute ALL:
 *    node index.js
 * ============================================================
 *
 *  📂 FILE OVERVIEW & WHAT YOU'LL LEARN
 *  ─────────────────────────────────────
 *
 *  01-recursion-basics.js        (10 problems)
 *  ├── Factorial, Fibonacci, Sum of Array
 *  ├── Reverse String, Power/Exponentiation
 *  ├── Flatten Nested Array, Deep Clone
 *  ├── Count Digits, Palindrome Check
 *  └── Tower of Hanoi
 *
 *  02-backtracking.js            (10 problems)
 *  ├── Subsets (Power Set), Permutations
 *  ├── Combination Sum, N-Queens
 *  ├── Sudoku Solver, Word Search in Grid
 *  ├── Generate Parentheses, Phone Letter Combos
 *  ├── Rat in Maze
 *  └── String Permutations
 *
 *  03-divide-and-conquer.js      (8 problems)
 *  ├── Merge Sort, Quick Sort
 *  ├── Binary Search, Maximum Subarray
 *  ├── Count Inversions, Closest Pair of Points
 *  ├── Matrix Multiplication
 *  └── Quick Select (K-th Smallest)
 *
 *  04-dynamic-programming.js     (10 problems)
 *  ├── Climbing Stairs, 0/1 Knapsack
 *  ├── Longest Common Subsequence, Coin Change
 *  ├── Longest Increasing Subsequence
 *  ├── Edit Distance, Matrix Chain Multiplication
 *  ├── Partition Equal Subset Sum
 *  ├── Word Break
 *  └── House Robber
 *
 *  05-greedy-algorithms.js       (8 problems)
 *  ├── Activity Selection, Fractional Knapsack
 *  ├── Huffman Coding, Minimum Platforms
 *  ├── Job Sequencing, Minimum Coins
 *  ├── Merge Intervals
 *  └── Jump Game
 *
 *  06-graphs-and-trees.js        (11 problems)
 *  ├── Tree Traversals (In/Pre/Post/Level order)
 *  ├── Max Depth, Balanced Tree Check
 *  ├── Lowest Common Ancestor
 *  ├── Graph DFS, Graph BFS
 *  ├── Cycle Detection, Topological Sort
 *  ├── Dijkstra Shortest Path
 *  └── Number of Islands
 *
 *  07-real-world-patterns.js     (8 problems)
 *  ├── File System Walker, JSON Path Finder
 *  ├── Route Planner (All paths), Expression Evaluator
 *  ├── Trie Autocomplete, Permission Checker (RBAC)
 *  ├── Dependency Resolver (npm-like)
 *  └── Recursive Form Validator
 *
 *  ────────────────────────────────────
 *  TOTAL: 65 problems with code + real-world usage
 *  ────────────────────────────────────
 */

const files = [
  "01-recursion-basics.js",
  "02-backtracking.js",
  "03-divide-and-conquer.js",
  "04-dynamic-programming.js",
  "05-greedy-algorithms.js",
  "06-graphs-and-trees.js",
  "07-real-world-patterns.js",
];

const divider = "═".repeat(60);

// Run a specific file or all
const target = process.argv[2];

if (target) {
  const file = files.find(f => f.includes(target));
  if (file) {
    console.log(`\n${divider}`);
    console.log(`  Running: ${file}`);
    console.log(`${divider}\n`);
    require(`./${file}`);
  } else {
    console.log(`File not found. Available: ${files.join(", ")}`);
  }
} else {
  console.log(`\n${divider}`);
  console.log("  🚀 RUNNING ALL ALGORITHM EXAMPLES");
  console.log(`${divider}\n`);

  for (const file of files) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`  📄 ${file}`);
    console.log(`${"─".repeat(60)}\n`);
    require(`./${file}`);
  }

  console.log(`\n${divider}`);
  console.log("  ✅ ALL 65 PROBLEMS EXECUTED SUCCESSFULLY");
  console.log(`${divider}\n`);
}
