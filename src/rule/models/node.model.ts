export class Node {
    type: string; // "operator" or "operand"
    left?: Node;  // left child (for operators)
    right?: Node; // right child (for operators)
    value?: any;  // value (for operands, like numbers or strings)
  
    constructor(type: string, left?: Node, right?: Node, value?: any) {
      this.type = type;
      this.left = left;
      this.right = right;
      this.value = value;
    }
  }
  