/**
 * ============================================================
 *  05 - GREEDY ALGORITHMS
 * ============================================================
 *  Greedy = At each step, pick the LOCALLY optimal choice
 *  hoping it leads to a GLOBALLY optimal solution.
 *
 *  When does Greedy work?
 *    - Greedy choice property (local optimum → global optimum)
 *    - Optimal substructure
 *
 *  When does Greedy FAIL?
 *    - When local choices don't guarantee global optimum
 *      (e.g., 0/1 Knapsack needs DP, but Fractional Knapsack is Greedy)
 * ============================================================
 */

// ─────────────────────────────────────────────
// 1. ACTIVITY SELECTION
// ─────────────────────────────────────────────
// Select maximum number of non-overlapping activities
// Real-world: Meeting room scheduling, CPU job scheduling, event planning
function activitySelection(activities) {
  // Sort by end time (greedy choice: earliest ending first)
  const sorted = activities
    .map((a, i) => ({ ...a, id: i }))
    .sort((a, b) => a.end - b.end);

  const selected = [sorted[0]];
  let lastEnd = sorted[0].end;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start >= lastEnd) {
      selected.push(sorted[i]);
      lastEnd = sorted[i].end;
    }
  }
  return selected;
}

const activities = [
  { start: 1, end: 4 },
  { start: 3, end: 5 },
  { start: 0, end: 6 },
  { start: 5, end: 7 },
  { start: 3, end: 9 },
  { start: 5, end: 9 },
  { start: 6, end: 10 },
  { start: 8, end: 11 },
  { start: 8, end: 12 },
  { start: 2, end: 14 },
  { start: 12, end: 16 },
];
console.log("Activity Selection:");
console.log(activitySelection(activities));

// ─────────────────────────────────────────────
// 2. FRACTIONAL KNAPSACK
// ─────────────────────────────────────────────
// Unlike 0/1 knapsack, you CAN take fractions of items
// Real-world: Cargo optimization, investment portfolio, bandwidth allocation
function fractionalKnapsack(items, capacity) {
  // Sort by value-to-weight ratio (descending)
  const sorted = items
    .map(item => ({ ...item, ratio: item.value / item.weight }))
    .sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0;
  let remaining = capacity;
  const taken = [];

  for (const item of sorted) {
    if (remaining <= 0) break;

    if (item.weight <= remaining) {
      taken.push({ ...item, fraction: 1 });
      totalValue += item.value;
      remaining -= item.weight;
    } else {
      const fraction = remaining / item.weight;
      taken.push({ ...item, fraction });
      totalValue += item.value * fraction;
      remaining = 0;
    }
  }

  return { totalValue: Math.round(totalValue * 100) / 100, taken };
}

const items = [
  { name: "Gold", weight: 10, value: 60 },
  { name: "Silver", weight: 20, value: 100 },
  { name: "Bronze", weight: 30, value: 120 },
];
console.log("\nFractional Knapsack (capacity=50):");
console.log(fractionalKnapsack(items, 50));
// totalValue: 240

// ─────────────────────────────────────────────
// 3. HUFFMAN CODING
// ─────────────────────────────────────────────
// Real-world: Data compression (ZIP, JPEG, MP3), text encoding
function huffmanCoding(text) {
  // Count frequencies
  const freq = {};
  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Build priority queue (min-heap via sorted array for simplicity)
  let nodes = Object.entries(freq).map(([char, f]) => ({ char, freq: f }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    });
  }

  const root = nodes[0];
  const codes = {};

  function buildCodes(node, code = "") {
    if (!node) return;
    if (node.char) {
      codes[node.char] = code || "0";
      return;
    }
    buildCodes(node.left, code + "0");
    buildCodes(node.right, code + "1");
  }

  buildCodes(root);
  const encoded = text.split("").map(c => codes[c]).join("");

  return { codes, encoded, compressionRatio: (encoded.length / (text.length * 8) * 100).toFixed(1) + "%" };
}

console.log("\nHuffman Coding for 'aaaaabbbbbbbbbcccccccccccdddddddddddddeeeee':");
const huffResult = huffmanCoding("aaaaabbbbbbbbbcccccccccccdddddddddddddeeeee");
console.log("  Codes:", huffResult.codes);
console.log("  Compression ratio:", huffResult.compressionRatio);

// ─────────────────────────────────────────────
// 4. MINIMUM PLATFORMS (MERGE INTERVALS variant)
// ─────────────────────────────────────────────
// Min platforms needed so no train waits
// Real-world: Server capacity planning, parking lot design, hospital beds
function minPlatforms(arrivals, departures) {
  arrivals.sort((a, b) => a - b);
  departures.sort((a, b) => a - b);

  let platforms = 0, maxPlatforms = 0;
  let i = 0, j = 0;

  while (i < arrivals.length) {
    if (arrivals[i] <= departures[j]) {
      platforms++;
      maxPlatforms = Math.max(maxPlatforms, platforms);
      i++;
    } else {
      platforms--;
      j++;
    }
  }
  return maxPlatforms;
}

console.log("\nMin Platforms for trains:");
console.log(minPlatforms(
  [900, 940, 950, 1100, 1500, 1800],
  [910, 1200, 1120, 1130, 1900, 2000]
)); // 3

// ─────────────────────────────────────────────
// 5. JOB SEQUENCING WITH DEADLINES
// ─────────────────────────────────────────────
// Real-world: Task scheduling, project management, deadline optimization
function jobSequencing(jobs) {
  // Sort by profit (descending)
  const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
  const maxDeadline = Math.max(...sorted.map(j => j.deadline));
  const slots = Array(maxDeadline + 1).fill(null);
  let totalProfit = 0;
  const scheduled = [];

  for (const job of sorted) {
    // Find the latest available slot before deadline
    for (let slot = job.deadline; slot >= 1; slot--) {
      if (slots[slot] === null) {
        slots[slot] = job;
        totalProfit += job.profit;
        scheduled.push({ ...job, assignedSlot: slot });
        break;
      }
    }
  }
  return { totalProfit, scheduled };
}

const jobs = [
  { id: "A", deadline: 2, profit: 100 },
  { id: "B", deadline: 1, profit: 19 },
  { id: "C", deadline: 2, profit: 27 },
  { id: "D", deadline: 1, profit: 25 },
  { id: "E", deadline: 3, profit: 15 },
];
console.log("\nJob Sequencing:");
console.log(jobSequencing(jobs));

// ─────────────────────────────────────────────
// 6. MINIMUM COINS (Greedy — works for standard denominations)
// ─────────────────────────────────────────────
// Real-world: ATM cash dispensing, change making
// NOTE: Greedy works for standard coin systems. Use DP for arbitrary denominations.
function minCoinsGreedy(coins, amount) {
  coins.sort((a, b) => b - a);   // largest first
  const result = [];
  let remaining = amount;

  for (const coin of coins) {
    while (remaining >= coin) {
      result.push(coin);
      remaining -= coin;
    }
  }
  return remaining === 0 ? result : null;
}

console.log("\nMin Coins Greedy for 93 cents [25,10,5,1]:");
console.log(minCoinsGreedy([25, 10, 5, 1], 93));
// [25, 25, 25, 10, 5, 1, 1, 1]

// ─────────────────────────────────────────────
// 7. MERGE INTERVALS
// ─────────────────────────────────────────────
// Real-world: Calendar merging, IP range consolidation, gene mapping
function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);  // merge (extend end)
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}

console.log("\nMerge Intervals [[1,3],[2,6],[8,10],[15,18]]:");
console.log(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]));
// [[1,6],[8,10],[15,18]]

// ─────────────────────────────────────────────
// 8. JUMP GAME
// ─────────────────────────────────────────────
// Can you reach the last index? nums[i] = max jump from position i
// Real-world: Network hop analysis, game level feasibility
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}

console.log("\nJump Game [2,3,1,1,4]:", canJump([2, 3, 1, 1, 4]));   // true
console.log("Jump Game [3,2,1,0,4]:", canJump([3, 2, 1, 0, 4]));     // false

module.exports = {
  activitySelection, fractionalKnapsack, huffmanCoding,
  minPlatforms, jobSequencing, minCoinsGreedy,
  mergeIntervals, canJump,
};
