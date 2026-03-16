/**
 * ============================================================
 *  02 - BACKTRACKING
 * ============================================================
 *  Backtracking = Try all possibilities, UNDO (backtrack) when
 *  a choice leads to a dead end, and try the next option.
 *
 *  Pattern:
 *    function backtrack(choices, path, result) {
 *      if (goal reached)  { result.push([...path]); return; }
 *      for (choice of choices) {
 *        if (isValid(choice)) {
 *          path.push(choice);          // make choice
 *          backtrack(remaining, path, result);
 *          path.pop();                 // UNDO choice (backtrack)
 *        }
 *      }
 *    }
 * ============================================================
 */

// ─────────────────────────────────────────────
// 1. GENERATE ALL SUBSETS (Power Set)
// ─────────────────────────────────────────────
// Real-world: Feature toggles, combination testing, menu combos
function subsets(nums) {
  const result = [];

  function backtrack(start, current) {
    result.push([...current]);          // every intermediate state is a valid subset
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);            // choose
      backtrack(i + 1, current);        // explore
      current.pop();                    // un-choose (backtrack)
    }
  }

  backtrack(0, []);
  return result;
}
console.log("Subsets of [1,2,3]:");
console.log(subsets([1, 2, 3]));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]

// ─────────────────────────────────────────────
// 2. PERMUTATIONS
// ─────────────────────────────────────────────
// Real-world: Scheduling, route optimization, password generation
function permutations(nums) {
  const result = [];

  function backtrack(current, remaining) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);                                // choose
      const next = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
      backtrack(current, next);                                  // explore
      current.pop();                                             // un-choose
    }
  }

  backtrack([], nums);
  return result;
}
console.log("\nPermutations of [1,2,3]:");
console.log(permutations([1, 2, 3]));

// ─────────────────────────────────────────────
// 3. COMBINATION SUM
// ─────────────────────────────────────────────
// Find all unique combos in candidates that sum to target (can reuse elements)
// Real-world: Coin change problem, budget allocation, shopping cart combos
function combinationSum(candidates, target) {
  const result = [];
  candidates.sort((a, b) => a - b);

  function backtrack(start, current, remaining) {
    if (remaining === 0) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;      // pruning — no point going further
      current.push(candidates[i]);
      backtrack(i, current, remaining - candidates[i]);   // same index = reuse allowed
      current.pop();
    }
  }

  backtrack(0, [], target);
  return result;
}
console.log("\nCombination Sum [2,3,6,7], target=7:");
console.log(combinationSum([2, 3, 6, 7], 7));
// [[2,2,3], [7]]

// ─────────────────────────────────────────────
// 4. N-QUEENS PROBLEM
// ─────────────────────────────────────────────
// Place N queens on an NxN board so no two attack each other
// Real-world: Constraint satisfaction, resource allocation, VLSI design
function solveNQueens(n) {
  const result = [];
  const board = Array.from({ length: n }, () => Array(n).fill("."));

  function isValid(row, col) {
    // Check column
    for (let r = 0; r < row; r++) {
      if (board[r][col] === "Q") return false;
    }
    // Check upper-left diagonal
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
      if (board[r][c] === "Q") return false;
    }
    // Check upper-right diagonal
    for (let r = row - 1, c = col + 1; r >= 0 && c < n; r--, c++) {
      if (board[r][c] === "Q") return false;
    }
    return true;
  }

  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join("")));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = "Q";        // place queen
        backtrack(row + 1);
        board[row][col] = ".";        // remove queen (backtrack)
      }
    }
  }

  backtrack(0);
  return result;
}
console.log("\nN-Queens (4x4) solutions:");
solveNQueens(4).forEach((solution, i) => {
  console.log(`  Solution ${i + 1}:`);
  solution.forEach(row => console.log(`    ${row}`));
});

// ─────────────────────────────────────────────
// 5. SUDOKU SOLVER
// ─────────────────────────────────────────────
// Real-world: Constraint propagation, puzzle apps, AI game solving
function solveSudoku(board) {
  function isValid(board, row, col, num) {
    const char = String(num);
    // Check row & column
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === char) return false;
      if (board[i][col] === char) return false;
    }
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (board[r][c] === char) return false;
      }
    }
    return true;
  }

  function solve(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === ".") {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = String(num);   // try
              if (solve(board)) return true;    // explore
              board[row][col] = ".";            // backtrack
            }
          }
          return false;   // no valid number → dead end
        }
      }
    }
    return true;   // all cells filled
  }

  solve(board);
  return board;
}

// Mini demo (not full 9x9 for brevity)
console.log("\nSudoku Solver: (see code for full 9x9 implementation)");

// ─────────────────────────────────────────────
// 6. WORD SEARCH IN GRID
// ─────────────────────────────────────────────
// Real-world: Text mining, game boards (Boggle), pattern matching in 2D data
function wordSearch(board, word) {
  const rows = board.length;
  const cols = board[0].length;
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

  function backtrack(row, col, index) {
    if (index === word.length) return true;
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    if (board[row][col] !== word[index]) return false;

    const temp = board[row][col];
    board[row][col] = "#";           // mark visited

    for (const [dr, dc] of directions) {
      if (backtrack(row + dr, col + dc, index + 1)) return true;
    }

    board[row][col] = temp;          // unmark (backtrack)
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (backtrack(r, c, 0)) return true;
    }
  }
  return false;
}

const grid = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log("\nWord Search 'ABCCED':", wordSearch(grid, "ABCCED")); // true

// ─────────────────────────────────────────────
// 7. GENERATE PARENTHESES
// ─────────────────────────────────────────────
// Real-world: Code generation, expression parsing, compiler design
function generateParentheses(n) {
  const result = [];

  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    if (open < n) {
      backtrack(current + "(", open + 1, close);     // can still open
    }
    if (close < open) {
      backtrack(current + ")", open, close + 1);     // can close
    }
  }

  backtrack("", 0, 0);
  return result;
}
console.log("\nGenerate Parentheses (n=3):");
console.log(generateParentheses(3));
// ["((()))","(()())","(())()","()(())","()()()"]

// ─────────────────────────────────────────────
// 8. LETTER COMBINATIONS OF PHONE NUMBER
// ─────────────────────────────────────────────
// Real-world: Autocomplete, T9 keyboard, SMS text prediction
function letterCombinations(digits) {
  if (!digits.length) return [];

  const map = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
  };
  const result = [];

  function backtrack(index, current) {
    if (index === digits.length) {
      result.push(current);
      return;
    }
    for (const char of map[digits[index]]) {
      backtrack(index + 1, current + char);
    }
  }

  backtrack(0, "");
  return result;
}
console.log("\nPhone letter combos for '23':");
console.log(letterCombinations("23"));
// ["ad","ae","af","bd","be","bf","cd","ce","cf"]

// ─────────────────────────────────────────────
// 9. RAT IN A MAZE
// ─────────────────────────────────────────────
// Real-world: Robot navigation, GPS pathfinding, game AI
function ratInMaze(maze) {
  const n = maze.length;
  const solution = Array.from({ length: n }, () => Array(n).fill(0));
  const paths = [];

  function isSafe(row, col) {
    return row >= 0 && row < n && col >= 0 && col < n
      && maze[row][col] === 1 && solution[row][col] === 0;
  }

  function solve(row, col, path) {
    if (row === n - 1 && col === n - 1) {
      solution[row][col] = 1;
      paths.push([...path, `(${row},${col})`]);
      solution[row][col] = 0;
      return;
    }

    if (!isSafe(row, col)) return;

    solution[row][col] = 1;
    const currentPath = [...path, `(${row},${col})`];

    solve(row + 1, col, currentPath);   // Down
    solve(row, col + 1, currentPath);   // Right
    solve(row - 1, col, currentPath);   // Up
    solve(row, col - 1, currentPath);   // Left

    solution[row][col] = 0;             // backtrack
  }

  solve(0, 0, []);
  return paths;
}

const maze = [
  [1, 0, 0, 0],
  [1, 1, 0, 1],
  [0, 1, 0, 0],
  [1, 1, 1, 1],
];
console.log("\nRat in Maze paths:");
ratInMaze(maze).forEach(p => console.log("  ", p.join(" → ")));

// ─────────────────────────────────────────────
// 10. STRING PERMUTATIONS (with duplicates handled)
// ─────────────────────────────────────────────
// Real-world: Anagram generation, word games, cryptography
function stringPermutations(str) {
  const result = new Set();
  const chars = str.split("");

  function backtrack(current, remaining) {
    if (remaining.length === 0) {
      result.add(current);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      backtrack(
        current + remaining[i],
        remaining.slice(0, i) + remaining.slice(i + 1)
      );
    }
  }

  backtrack("", chars.join(""));
  return [...result];
}
console.log("\nString Permutations of 'abc':");
console.log(stringPermutations("abc"));

module.exports = {
  subsets, permutations, combinationSum, solveNQueens,
  solveSudoku, wordSearch, generateParentheses,
  letterCombinations, ratInMaze, stringPermutations,
};
