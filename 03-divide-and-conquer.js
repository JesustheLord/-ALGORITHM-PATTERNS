/**
 * ============================================================
 *  03 - DIVIDE AND CONQUER
 * ============================================================
 *  Divide & Conquer = Split the problem into smaller sub-problems,
 *  solve each independently, then COMBINE results.
 *
 *  Pattern:
 *    function solve(problem) {
 *      if (small enough)  return baseSolution;
 *      left  = solve(leftHalf);
 *      right = solve(rightHalf);
 *      return combine(left, right);
 *    }
 * ============================================================
 */

// ─────────────────────────────────────────────
// 1. MERGE SORT  — O(n log n)
// ─────────────────────────────────────────────
// Real-world: Database sorting, external sorting of large files, stable sort requirement
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));     // divide
  const right = mergeSort(arr.slice(mid));        // divide

  return merge(left, right);                      // conquer + combine
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

console.log("Merge Sort [38,27,43,3,9,82,10]:");
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]

// ─────────────────────────────────────────────
// 2. QUICK SORT  — O(n log n) average
// ─────────────────────────────────────────────
// Real-world: In-memory sorting (V8 engine uses TimSort, a hybrid), partitioning
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [], right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log("\nQuick Sort [10,7,8,9,1,5]:");
console.log(quickSort([10, 7, 8, 9, 1, 5]));

// ─────────────────────────────────────────────
// 3. BINARY SEARCH  — O(log n)
// ─────────────────────────────────────────────
// Real-world: Database index lookup, dictionary search, git bisect
function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);
  return binarySearch(arr, target, left, mid - 1);
}

const sorted = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log("\nBinary Search for 23 in sorted array:", binarySearch(sorted, 23)); // 5

// ─────────────────────────────────────────────
// 4. MAXIMUM SUBARRAY (Divide & Conquer approach)
// ─────────────────────────────────────────────
// Real-world: Stock market analysis, signal processing, performance windows
function maxSubArray(arr, left = 0, right = arr.length - 1) {
  if (left === right) return arr[left];

  const mid = Math.floor((left + right) / 2);

  // Max crossing sum (must include mid and mid+1)
  let leftSum = -Infinity, rightSum = -Infinity;
  let sum = 0;
  for (let i = mid; i >= left; i--) {
    sum += arr[i];
    leftSum = Math.max(leftSum, sum);
  }
  sum = 0;
  for (let i = mid + 1; i <= right; i++) {
    sum += arr[i];
    rightSum = Math.max(rightSum, sum);
  }
  const crossSum = leftSum + rightSum;

  const leftMax = maxSubArray(arr, left, mid);
  const rightMax = maxSubArray(arr, mid + 1, right);

  return Math.max(leftMax, rightMax, crossSum);
}

console.log("\nMax Subarray Sum [-2,1,-3,4,-1,2,1,-5,4]:");
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6

// ─────────────────────────────────────────────
// 5. COUNT INVERSIONS
// ─────────────────────────────────────────────
// Real-world: Ranking systems, collaborative filtering, measuring "sortedness"
function countInversions(arr) {
  if (arr.length <= 1) return { sorted: arr, count: 0 };

  const mid = Math.floor(arr.length / 2);
  const left = countInversions(arr.slice(0, mid));
  const right = countInversions(arr.slice(mid));

  let count = left.count + right.count;
  const merged = [];
  let i = 0, j = 0;

  while (i < left.sorted.length && j < right.sorted.length) {
    if (left.sorted[i] <= right.sorted[j]) {
      merged.push(left.sorted[i++]);
    } else {
      merged.push(right.sorted[j++]);
      count += left.sorted.length - i;   // all remaining left elements are inversions
    }
  }

  return {
    sorted: [...merged, ...left.sorted.slice(i), ...right.sorted.slice(j)],
    count,
  };
}

console.log("\nInversions in [2,4,1,3,5]:", countInversions([2, 4, 1, 3, 5]).count); // 3

// ─────────────────────────────────────────────
// 6. CLOSEST PAIR OF POINTS  — O(n log n)
// ─────────────────────────────────────────────
// Real-world: Collision detection, nearest neighbor, GPS proximity
function closestPair(points) {
  const sorted = [...points].sort((a, b) => a[0] - b[0]);

  function dist(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
  }

  function solve(pts) {
    if (pts.length <= 3) {
      let minDist = Infinity;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          minDist = Math.min(minDist, dist(pts[i], pts[j]));
        }
      }
      return minDist;
    }

    const mid = Math.floor(pts.length / 2);
    const leftMin = solve(pts.slice(0, mid));
    const rightMin = solve(pts.slice(mid));
    let d = Math.min(leftMin, rightMin);

    // Check strip (points within distance d of the midline)
    const midX = pts[mid][0];
    const strip = pts.filter(p => Math.abs(p[0] - midX) < d);
    strip.sort((a, b) => a[1] - b[1]);

    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && (strip[j][1] - strip[i][1]) < d; j++) {
        d = Math.min(d, dist(strip[i], strip[j]));
      }
    }
    return d;
  }

  return solve(sorted);
}

const points = [[2, 3], [12, 30], [40, 50], [5, 1], [12, 10], [3, 4]];
console.log("\nClosest pair distance:", closestPair(points).toFixed(2)); // 1.41

// ─────────────────────────────────────────────
// 7. STRASSEN'S MATRIX MULTIPLICATION (Conceptual)
// ─────────────────────────────────────────────
// Real-world: Machine learning (weight matrices), computer graphics, physics simulations
function matrixMultiply(A, B) {
  const n = A.length;
  if (n === 1) return [[A[0][0] * B[0][0]]];

  // Simple recursive 2x2 demonstration
  const result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

const A = [[1, 2], [3, 4]];
const B = [[5, 6], [7, 8]];
console.log("\nMatrix Multiply [[1,2],[3,4]] x [[5,6],[7,8]]:");
console.log(matrixMultiply(A, B));
// [[19, 22], [43, 50]]

// ─────────────────────────────────────────────
// 8. K-TH SMALLEST ELEMENT (Quick Select) — O(n) avg
// ─────────────────────────────────────────────
// Real-world: Median finding, order statistics, percentile calculation
function quickSelect(arr, k) {
  if (arr.length === 1) return arr[0];

  const pivot = arr[Math.floor(Math.random() * arr.length)];
  const left = arr.filter(x => x < pivot);
  const equal = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  if (k <= left.length) {
    return quickSelect(left, k);
  } else if (k <= left.length + equal.length) {
    return pivot;
  } else {
    return quickSelect(right, k - left.length - equal.length);
  }
}

console.log("\n3rd smallest in [7,10,4,3,20,15]:", quickSelect([7, 10, 4, 3, 20, 15], 3)); // 7

module.exports = {
  mergeSort, quickSort, binarySearch, maxSubArray,
  countInversions, closestPair, matrixMultiply, quickSelect,
};
