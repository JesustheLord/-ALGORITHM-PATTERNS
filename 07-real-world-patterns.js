/**
 * ============================================================
 *  07 - REAL-WORLD PATTERNS (Practical Recursion & Backtracking)
 * ============================================================
 *  Everyday scenarios where recursion and backtracking shine.
 * ============================================================
 */

// ─────────────────────────────────────────────
// 1. FILE SYSTEM WALKER (Recursive directory traversal)
// ─────────────────────────────────────────────
// Real-world: npm package resolution, webpack module bundling, find command
const fs = require("fs");
const path = require("path");

function walkDirectory(dir, depth = 0) {
  const indent = "  ".repeat(depth);
  const entries = [];

  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === "node_modules" || item === ".git") continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        entries.push({ type: "dir", name: item, children: walkDirectory(fullPath, depth + 1) });
      } else {
        entries.push({ type: "file", name: item, size: stat.size });
      }
    }
  } catch (e) {
    // skip inaccessible directories
  }
  return entries;
}

// Uncomment to test:
// console.log(JSON.stringify(walkDirectory(__dirname), null, 2));
console.log("1. walkDirectory — Recursive file system traversal (see code)");

// ─────────────────────────────────────────────
// 2. JSON PATH FINDER (Find all paths to a value)
// ─────────────────────────────────────────────
// Real-world: API response parsing, config file analysis, debugging nested objects
function findJsonPaths(obj, target, currentPath = "$") {
  const paths = [];

  if (obj === target) {
    paths.push(currentPath);
  }

  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      const newPath = Array.isArray(obj) ? `${currentPath}[${key}]` : `${currentPath}.${key}`;
      paths.push(...findJsonPaths(obj[key], target, newPath));
    }
  }
  return paths;
}

const apiResponse = {
  users: [
    { name: "Alice", roles: ["admin", "user"], active: true },
    { name: "Bob", roles: ["user"], active: false },
    { name: "Charlie", roles: ["admin"], active: true },
  ],
  metadata: { total: 3, active: true },
};

console.log("\n2. Find all paths to value 'true' in JSON:");
console.log(findJsonPaths(apiResponse, true));
// ["$.users[0].active", "$.users[2].active", "$.metadata.active"]

// ─────────────────────────────────────────────
// 3. ROUTE PLANNER (All paths between two cities)
// ─────────────────────────────────────────────
// Real-world: Flight routing, delivery route optimization, network path discovery
function findAllRoutes(graph, start, end, visited = new Set()) {
  if (start === end) return [[end]];

  visited.add(start);
  const routes = [];

  for (const neighbor of (graph[start] || [])) {
    if (!visited.has(neighbor)) {
      const subRoutes = findAllRoutes(graph, neighbor, end, visited);
      for (const route of subRoutes) {
        routes.push([start, ...route]);
      }
    }
  }

  visited.delete(start);   // backtrack — allow this city in other paths
  return routes;
}

const cityMap = {
  NYC: ["Chicago", "Boston"],
  Chicago: ["Denver", "Boston"],
  Boston: ["Denver"],
  Denver: ["LA"],
  LA: [],
};
console.log("\n3. All routes NYC → LA:");
findAllRoutes(cityMap, "NYC", "LA").forEach(r => console.log("  ", r.join(" → ")));

// ─────────────────────────────────────────────
// 4. EXPRESSION EVALUATOR (Recursive Descent Parser)
// ─────────────────────────────────────────────
// Real-world: Calculators, template engines, SQL parsers, compilers
function evaluate(expression) {
  let pos = 0;

  function parseExpression() {
    let result = parseTerm();
    while (pos < expression.length && (expression[pos] === "+" || expression[pos] === "-")) {
      const op = expression[pos++];
      const term = parseTerm();
      result = op === "+" ? result + term : result - term;
    }
    return result;
  }

  function parseTerm() {
    let result = parseFactor();
    while (pos < expression.length && (expression[pos] === "*" || expression[pos] === "/")) {
      const op = expression[pos++];
      const factor = parseFactor();
      result = op === "*" ? result * factor : result / factor;
    }
    return result;
  }

  function parseFactor() {
    if (expression[pos] === "(") {
      pos++;   // skip '('
      const result = parseExpression();
      pos++;   // skip ')'
      return result;
    }
    let num = "";
    while (pos < expression.length && /[\d.]/.test(expression[pos])) {
      num += expression[pos++];
    }
    return parseFloat(num);
  }

  return parseExpression();
}

console.log("\n4. Expression Evaluator:");
console.log("  '3+5*2'       =", evaluate("3+5*2"));       // 13
console.log("  '(3+5)*2'     =", evaluate("(3+5)*2"));     // 16
console.log("  '10+2*6'      =", evaluate("10+2*6"));      // 22
console.log("  '100*2+12'    =", evaluate("100*2+12"));    // 212

// ─────────────────────────────────────────────
// 5. AUTOCOMPLETE / TRIE WITH SUGGESTIONS
// ─────────────────────────────────────────────
// Real-world: Search engines, IDE autocomplete, spell checkers
class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
  }

  // Recursive search for all words with given prefix
  autocomplete(prefix, maxResults = 5) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    const results = [];
    this._collectWords(node, prefix, results, maxResults);
    return results;
  }

  _collectWords(node, prefix, results, maxResults) {
    if (results.length >= maxResults) return;
    if (node.isEnd) results.push(prefix);

    for (const [char, child] of Object.entries(node.children)) {
      this._collectWords(child, prefix + char, results, maxResults);
    }
  }
}

const trie = new Trie();
["apple", "application", "apply", "banana", "band", "app", "ape"].forEach(w => trie.insert(w));
console.log("\n5. Autocomplete 'app':", trie.autocomplete("app"));
// ["app", "apple", "application", "apply"]

// ─────────────────────────────────────────────
// 6. PERMISSION CHECKER (Recursive role hierarchy)
// ─────────────────────────────────────────────
// Real-world: RBAC systems, AWS IAM, Active Directory
function hasPermission(roles, user, permission) {
  function check(roleName, visited = new Set()) {
    if (visited.has(roleName)) return false;  // prevent infinite loops
    visited.add(roleName);

    const role = roles[roleName];
    if (!role) return false;

    if (role.permissions.includes(permission)) return true;

    // Check inherited roles (recursion)
    for (const parent of (role.inherits || [])) {
      if (check(parent, visited)) return true;
    }
    return false;
  }

  for (const userRole of user.roles) {
    if (check(userRole)) return true;
  }
  return false;
}

const rolesConfig = {
  viewer:  { permissions: ["read"] },
  editor:  { permissions: ["write"], inherits: ["viewer"] },
  admin:   { permissions: ["delete", "manage-users"], inherits: ["editor"] },
  superadmin: { permissions: ["system-config"], inherits: ["admin"] },
};
const user = { name: "Alice", roles: ["editor"] };

console.log("\n6. Permission Checker:");
console.log("  editor has 'read'?", hasPermission(rolesConfig, user, "read"));     // true (inherited)
console.log("  editor has 'write'?", hasPermission(rolesConfig, user, "write"));   // true
console.log("  editor has 'delete'?", hasPermission(rolesConfig, user, "delete")); // false

// ─────────────────────────────────────────────
// 7. DEPENDENCY RESOLVER (npm-like)
// ─────────────────────────────────────────────
// Real-world: Package managers (npm, pip), build systems, module loaders
function resolveDependencies(packages, target) {
  const order = [];
  const visited = new Set();
  const inStack = new Set();

  function resolve(pkg) {
    if (inStack.has(pkg)) throw new Error(`Circular dependency: ${pkg}`);
    if (visited.has(pkg)) return;

    inStack.add(pkg);
    for (const dep of (packages[pkg] || [])) {
      resolve(dep);   // resolve dependencies first (recursion)
    }
    inStack.delete(pkg);
    visited.add(pkg);
    order.push(pkg);
  }

  resolve(target);
  return order;
}

const packages = {
  express:       ["body-parser", "cookie-parser", "debug"],
  "body-parser": ["bytes", "content-type"],
  "cookie-parser": ["cookie"],
  debug:         ["ms"],
  bytes:         [],
  "content-type": [],
  cookie:        [],
  ms:            [],
};
console.log("\n7. Install order for 'express':");
console.log("  ", resolveDependencies(packages, "express"));

// ─────────────────────────────────────────────
// 8. FORM VALIDATOR (Recursive nested form validation)
// ─────────────────────────────────────────────
// Real-world: Complex form validation, JSON schema validation
function validateForm(data, schema, path = "") {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const fullPath = path ? `${path}.${field}` : field;
    const value = data[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${fullPath} is required`);
      continue;
    }

    if (value === undefined) continue;

    if (rules.type && typeof value !== rules.type) {
      errors.push(`${fullPath} must be type ${rules.type}`);
    }

    if (rules.min !== undefined && value < rules.min) {
      errors.push(`${fullPath} must be >= ${rules.min}`);
    }

    if (rules.max !== undefined && value > rules.max) {
      errors.push(`${fullPath} must be <= ${rules.max}`);
    }

    // RECURSIVE: nested object validation
    if (rules.nested && typeof value === "object") {
      errors.push(...validateForm(value, rules.nested, fullPath));
    }
  }
  return errors;
}

const formSchema = {
  name:  { required: true, type: "string" },
  age:   { required: true, type: "number", min: 0, max: 150 },
  address: {
    required: true,
    type: "object",
    nested: {
      street: { required: true, type: "string" },
      zip:    { required: true, type: "string" },
      city:   { required: true, type: "string" },
    },
  },
};

const formData = {
  name: "Alice",
  age: 200,
  address: { street: "123 Main St", zip: "" },
};

console.log("\n8. Form Validation Errors:");
validateForm(formData, formSchema).forEach(e => console.log("  ❌", e));

console.log("\n✅ All real-world examples complete!");
