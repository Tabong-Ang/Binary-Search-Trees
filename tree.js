import Node from "./node.js";

class Tree {
  constructor(array) {
    this.root = this.buildTree([...new Set(array)].sort((a, b) => a - b));
  }

  buildTree(array) {
    if (array.length === 0) {
      return null;
    }

    const mid = Math.floor(array.length / 2);
    const node = new Node(array[mid]);

    node.left = this.buildTree(array.slice(0, mid));
    node.right = this.buildTree(array.slice(mid + 1));

    return node;
  }

  insert(value, node = this.root) {
    // If the tree is empty, create the root node
    if (this.root === null) {
      this.root = new Node(value);
      return;
    }

    if (value < node.data) {
      // Insert into the left subtree
      if (node.left === null) {
        node.left = new Node(value);
      } else {
        this.insert(value, node.left);
      }
    } else {
      // Insert into the right subtree
      if (node.right === null) {
        node.right = new Node(value);
      } else {
        this.insert(value, node.right);
      }
    }
  }

  deleteItem(value, node = this.root) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.deleteItem(value, node.left);
    } else if (value > node.data) {
      node.right = this.deleteItem(value, node.right);
    } else {
      // Node to be deleted found
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      // Node with two children: get the inorder successor
      node.data = this.minValue(node.right);
      node.right = this.deleteItem(node.data, node.right);
    }
    return node;
  }

  minValue(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current.data;
  }

  // Iterative version of levelOrder
  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    const queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift();
      callback(node);

      if (node.left !== null) queue.push(node.left);
      if (node.right !== null) queue.push(node.right);
    }
  }

  // Recursive version of levelOrder
  levelOrderRecursive(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    const traverseLevel = (nodes) => {
      if (nodes.length === 0) return;
      const nextLevel = [];
      nodes.forEach((node) => {
        callback(node);
        if (node.left !== null) nextLevel.push(node.left);
        if (node.right !== null) nextLevel.push(node.right);
      });
      traverseLevel(nextLevel);
    };

    traverseLevel([this.root]);
  }

  inOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    if (node !== null) {
      this.inOrder(callback, node.left);
      callback(node);
      this.inOrder(callback, node.right);
    }
  }

  preOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    if (node !== null) {
      callback(node);
      this.preOrder(callback, node.left);
      this.preOrder(callback, node.right);
    }
  }

  postOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    if (node !== null) {
      this.postOrder(callback, node.left);
      this.postOrder(callback, node.right);
      callback(node);
    }
  }

  height(node) {
    if (node === null) {
      return -1; // Height of an empty tree is -1
    }
    return Math.max(this.height(node.left), this.height(node.right)) + 1;
  }

  depth(node, current = this.root, currentDepth = 0) {
    if (current === null) {
      return -1; // Node is not found
    }
    if (current === node) {
      return currentDepth; // Found the node, return depth
    }
    const leftDepth = this.depth(node, current.left, currentDepth + 1);
    if (leftDepth !== -1) return leftDepth; // Node found in the left subtree
    return this.depth(node, current.right, currentDepth + 1); // Search in the right subtree
  }

  isBalanced(node = this.root) {
    if (node === null) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  }

  rebalance() {
    const nodes = this.inOrderTraversal(this.root);
    this.root = this.buildTree(nodes);
  }

  inOrderTraversal(node, result = []) {
    if (node !== null) {
      this.inOrderTraversal(node.left, result);
      result.push(node.data);
      this.inOrderTraversal(node.right, result);
    }
    return result;
  }
}

// Generate an array of random numbers
function generateRandomNumbers(size, max) {
  const numbers = new Set();
  while (numbers.size < size) {
    numbers.add(Math.floor(Math.random() * max));
  }
  return Array.from(numbers);
}

// Main driver script
function main() {
  const randomNumbers = generateRandomNumbers(15, 100);
  const tree = new Tree(randomNumbers);

  console.log("Initial random numbers:", randomNumbers);
  console.log("Is the tree balanced?", tree.isBalanced());
  console.log("Level Order:");
  tree.levelOrder((node) => console.log(node.data));

  console.log("Pre Order:");
  tree.preOrder((node) => console.log(node.data));

  console.log("In Order:");
  tree.inOrder((node) => console.log(node.data));

  console.log("Post Order:");
  tree.postOrder((node) => console.log(node.data));
  const numbersToAdd = [101, 150, 200, 250, 300];
  numbersToAdd.forEach((num) => tree.insert(num));
  console.log(
    "Is the tree balanced after adding large numbers?",
    tree.isBalanced()
  );
  tree.rebalance();
  console.log("Is the tree balanced after rebalancing?", tree.isBalanced());
  console.log("Level Order after rebalancing:");
  tree.levelOrder((node) => console.log(node.data));

  console.log("Pre Order after rebalancing:");
  tree.preOrder((node) => console.log(node.data));

  console.log("In Order after rebalancing:");
  tree.inOrder((node) => console.log(node.data));

  console.log("Post Order after rebalancing:");
  tree.postOrder((node) => console.log(node.data));
}

main();

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
prettyPrint(tree.root);
