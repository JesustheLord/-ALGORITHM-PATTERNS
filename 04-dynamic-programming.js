/**
 * ============================================================
 *  04 - DYNAMIC PROGRAMMING (DP)
 * ============================================================
 *  DP = Recursion + Memoization  (avoid re-computing sub-problems)
 *
 *  Two approaches:
 *    Top-Down  = recursion + cache (memoization)
 *    Bottom-Up = iterative with a DP table
 *
 *  When to use DP?
 *    1. Overlapping sub-problems (same inputs computed many times)
 *    2. Optimal substructure (optimal solution built from optimal sub-solutions)
 * ============================================================
 */

// ─────────────────────────────────────────────
// 1. CLIMBING STAIRS
// ─────────────────────────────────────────────
// You can climb 1 or 2 steps. How many distinct ways to reach step n?
// Real-world: Path counting, Fibonacci variant, decision trees

// Top-Down (Memoization)
function climbStairsMemo(n, memo = {}) {
  if (n <= 2) return n;
  if (n in memo) return memo[n];
  memo[n] = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
  return memo[n];
}

// Bottom-Up (Tabulation)
function climbStairsDP(n) {
  if (n <= 2) return n;
  const dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

console.log("Climb Stairs (10):", climbStairsMemo(10), climbStairsDP(10)); // 89

// ─────────────────────────────────────────────
// 2. 0/1 KNAPSACK
// ─────────────────────────────────────────────
// Given weights & values, maximize value within weight capacity
// Real-world: Budget allocation, cargo loading, resource scheduling
function knapsack(weights, values, capacity) {
  const n = weights.length;
  // dp[i][w] = max value using first i items with capacity w
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];                                // don't take item i
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]       // take item i
        );
      }
    }
  }
  return dp[n][capacity];
}

console.log("\nKnapsack (weights=[1,3,4,5], values=[1,4,5,7], cap=7):");
console.log(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)); // 9

// ─────────────────────────────────────────────
// 3. LONGEST COMMON SUBSEQUENCE (LCS)
// ─────────────────────────────────────────────
// Real-world: Git diff, DNA sequence alignment, plagiarism detection
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find the actual subsequence
  let lcs = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs = text1[i - 1] + lcs;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return { length: dp[m][n], subsequence: lcs };
}

console.log("\nLCS of 'abcde' and 'ace':");
console.log(longestCommonSubsequence("abcde", "ace"));
// { length: 3, subsequence: 'ace' }

// ─────────────────────────────────────────────
// 4. COIN CHANGE (Minimum coins)
// ─────────────────────────────────────────────
// Real-world: Vending machines, currency exchange, payment optimization
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log("\nCoin Change [1,5,10,25], amount=36:", coinChange([1, 5, 10, 25], 36)); // 3

// ─────────────────────────────────────────────
// 5. LONGEST INCREASING SUBSEQUENCE (LIS)
// ─────────────────────────────────────────────
// Real-world: Stock analysis, patience sorting, sequence prediction
function longestIncreasingSubsequence(nums) {
  if (nums.length === 0) return 0;
  const dp = Array(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}

console.log("\nLIS of [10,9,2,5,3,7,101,18]:");
console.log(longestIncreasingSubsequence([10, 9, 2, 5, 3, 7, 101, 18])); // 4

// ─────────────────────────────────────────────
// 6. EDIT DISTANCE (Levenshtein Distance)
// ─────────────────────────────────────────────
// Real-world: Spell checker, autocorrect, DNA comparison, fuzzy matching
function editDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];              // chars match, no edit
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],       // delete
          dp[i][j - 1],       // insert
          dp[i - 1][j - 1]    // replace
        );
      }
    }
  }
  return dp[m][n];
}

console.log("\nEdit Distance 'kitten' → 'sitting':", editDistance("kitten", "sitting")); // 3

// ─────────────────────────────────────────────
// 7. MATRIX CHAIN MULTIPLICATION
// ─────────────────────────────────────────────
// Real-world: Query optimization (databases), GPU shader compilation
function matrixChainMultiplication(dims) {
  const n = dims.length - 1;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));

  for (let len = 2; len <= n; len++) {       // chain length
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[0][n - 1];
}

console.log("\nMatrix Chain [10,20,30,40,30]:", matrixChainMultiplication([10, 20, 30, 40, 30]));
// 30000

// ─────────────────────────────────────────────
// 8. PARTITION EQUAL SUBSET SUM
// ─────────────────────────────────────────────
// Real-world: Load balancing, team splitting, fair division
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;

  const target = total / 2;
  const dp = new Set([0]);

  for (const num of nums) {
    const newSums = new Set(dp);
    for (const s of dp) {
      newSums.add(s + num);
    }
    if (newSums.has(target)) return true;
    dp.clear();
    for (const s of newSums) dp.add(s);
  }
  return dp.has(target);
}

console.log("\nCan Partition [1,5,11,5]?", canPartition([1, 5, 11, 5])); // true
console.log("Can Partition [1,2,3,5]?", canPartition([1, 2, 3, 5]));     // false

// ─────────────────────────────────────────────
// 9. WORD BREAK
// ─────────────────────────────────────────────
// Real-world: NLP tokenization, search query parsing, URL slug parsing
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}

console.log("\nWord Break 'leetcode', ['leet','code']:", wordBreak("leetcode", ["leet", "code"])); // true
console.log("Word Break 'catsandog', ['cats','dog','sand','and','cat']:",
  wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // false

// ─────────────────────────────────────────────
// 10. HOUSE ROBBER
// ─────────────────────────────────────────────
// Can't rob two adjacent houses. Maximize total loot.
// Real-world: Scheduling non-adjacent tasks, resource allocation with conflicts
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let prev2 = 0, prev1 = 0;
  for (const num of nums) {
    const current = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}

console.log("\nHouse Robber [2,7,9,3,1]:", rob([2, 7, 9, 3, 1])); // 12

module.exports = {
  climbStairsMemo, climbStairsDP, knapsack,
  longestCommonSubsequence, coinChange,
  longestIncreasingSubsequence, editDistance,
  matrixChainMultiplication, canPartition,
  wordBreak, rob,
};
