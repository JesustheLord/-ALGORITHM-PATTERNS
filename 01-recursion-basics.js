/**
 * ============================================================
 *  01 - RECURSION BASICS
 * ============================================================
 *  Recursion = a function that calls itself with a smaller input
 *  until it reaches a BASE CASE.
 *
 *  Pattern:
 *    function solve(input) {
 *      if (baseCase)  return result;   // stop condition
 *      return solve(smallerInput);     // recursive step
 *    }
 * ============================================================
 */

// ─────────────────────────────────────────────
// 1. FACTORIAL  (n!)
// ─────────────────────────────────────────────
// Real-world: Permutations count, probability, combinatorics
function factorial(n) {
  if (n <= 1) return 1;            // base case
  return n * factorial(n - 1);     // recursive step
}
console.log("Factorial of 5:", factorial(5)); // 120

// ─────────────────────────────────────────────
// 2. FIBONACCI SEQUENCE
// ─────────────────────────────────────────────
// Real-world: Financial modeling, nature patterns, dynamic programming intro
function fibonacci(n) {
  if (n <= 0) return 0;            // base case 1
  if (n === 1) return 1;           // base case 2
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log("Fibonacci(7):", fibonacci(7)); // 13

// Optimized with MEMOIZATION (Top-Down DP)
function fibonacciMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 0) return 0;
  if (n === 1) return 1;
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}
console.log("Fibonacci(50) with memo:", fibonacciMemo(50)); // 12586269025

// ─────────────────────────────────────────────
// 3. SUM OF ARRAY (Recursion instead of loop)
// ─────────────────────────────────────────────
// Real-world: Aggregation in tree structures, MapReduce
function sumArray(arr, index = 0) {
  if (index >= arr.length) return 0;          // base case
  return arr[index] + sumArray(arr, index + 1);
}
console.log("Sum of [1,2,3,4,5]:", sumArray([1, 2, 3, 4, 5])); // 15

// ─────────────────────────────────────────────
// 4. REVERSE A STRING
// ─────────────────────────────────────────────
// Real-world: Palindrome checks, data transformation
function reverseString(str) {
  if (str.length <= 1) return str;
  return reverseString(str.slice(1)) + str[0];
}
console.log("Reverse 'hello':", reverseString("hello")); // "olleh"

// ─────────────────────────────────────────────
// 5. POWER / EXPONENTIATION  (x^n)
// ─────────────────────────────────────────────
// Real-world: Cryptography (modular exponentiation), scientific computing
function power(base, exp) {
  if (exp === 0) return 1;
  if (exp < 0) return 1 / power(base, -exp);
  // Fast power: O(log n)
  if (exp % 2 === 0) {
    const half = power(base, exp / 2);
    return half * half;
  }
  return base * power(base, exp - 1);
}
console.log("2^10:", power(2, 10)); // 1024

// ─────────────────────────────────────────────
// 6. FLATTEN NESTED ARRAY
// ─────────────────────────────────────────────
// Real-world: JSON parsing, DOM tree flattening, API response normalization
function flattenArray(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenArray(item));   // recurse into nested array
    } else {
      result.push(item);
    }
  }
  return result;
}
console.log("Flatten:", flattenArray([1, [2, [3, [4]], 5]])); // [1,2,3,4,5]

// ─────────────────────────────────────────────
// 7. DEEP CLONE AN OBJECT
// ─────────────────────────────────────────────
// Real-world: State management (Redux), immutable data, config copying
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
const original = { a: 1, b: { c: 2, d: [3, 4] } };
const cloned = deepClone(original);
cloned.b.c = 99;
console.log("Original:", original.b.c);  // 2  (unchanged)
console.log("Cloned:", cloned.b.c);      // 99

// ─────────────────────────────────────────────
// 8. COUNT DIGITS
// ─────────────────────────────────────────────
function countDigits(n) {
  n = Math.abs(n);
  if (n < 10) return 1;
  return 1 + countDigits(Math.floor(n / 10));
}
console.log("Digits in 12345:", countDigits(12345)); // 5

// ─────────────────────────────────────────────
// 9. PALINDROME CHECK
// ─────────────────────────────────────────────
// Real-world: DNA sequence analysis, string validation
function isPalindrome(str, left = 0, right = str.length - 1) {
  if (left >= right) return true;
  if (str[left] !== str[right]) return false;
  return isPalindrome(str, left + 1, right - 1);
}
console.log("'racecar' palindrome?", isPalindrome("racecar")); // true
console.log("'hello' palindrome?", isPalindrome("hello"));     // false

// ─────────────────────────────────────────────
// 10. TOWER OF HANOI
// ─────────────────────────────────────────────
// Real-world: Disk scheduling, puzzle solving, understanding recursion depth
function towerOfHanoi(n, from = "A", to = "C", aux = "B") {
  if (n === 1) {
    console.log(`  Move disk 1 from ${from} to ${to}`);
    return;
  }
  towerOfHanoi(n - 1, from, aux, to);
  console.log(`  Move disk ${n} from ${from} to ${to}`);
  towerOfHanoi(n - 1, aux, to, from);
}
console.log("Tower of Hanoi (3 disks):");
towerOfHanoi(3);

module.exports = {
  factorial, fibonacci, fibonacciMemo, sumArray,
  reverseString, power, flattenArray, deepClone,
  countDigits, isPalindrome, towerOfHanoi,
};
