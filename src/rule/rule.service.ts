import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Node } from './models/node.model';
import { Rule, RuleSchema } from './models/rule.schema';

@Injectable()
export class RuleService {
  constructor(@InjectModel(RuleSchema.name) private ruleModel: Model<Rule>) { }

  createAST(rule: string): Node | null {
    rule = rule.trim().replace(/\s+/g, ' ');

    const andMatch = rule.match(/(.*) AND (.*)/);
    if (andMatch) {
      return new Node(
        "operator",
        this.createAST(andMatch[1]),
        this.createAST(andMatch[2]),
        "AND"
      );
    }

    const orMatch = rule.match(/(.*) OR (.*)/);
    if (orMatch) {
      return new Node(
        "operator",
        this.createAST(orMatch[1]),
        this.createAST(orMatch[2]),
        "OR"
      );
    }

    const comparisonMatch = rule.match(/([a-zA-Z]+)\s*([<>]=?|=)\s*('[^']+'|[0-9]+)/);
    if (comparisonMatch) {
      const [_, left, operator, right] = comparisonMatch;
      return new Node(
        "operator",
        new Node("operand", undefined, undefined, left.trim()),
        new Node("operand", undefined, undefined, right.trim()), // right can be string literal or number
        operator.trim()
      );
    }

    return null;
  }

  async saveRule(rule: string): Promise<Rule> {
    // Check if the rule already exists
    const existingRule = await this.ruleModel.findOne({ rule }).exec();

    if (existingRule) {
      // If the rule exists, throw a ConflictException
      throw new ConflictException('This rule already exists.');
    }

    const ast = this.createAST(rule); // Assuming createAST is a method in your service
    const newRule = new this.ruleModel({ rule, ast });

    try {
      return await newRule.save();
    } catch (error) {
      // Handle specific Mongoose errors
      if (error.code === 11000) { // Duplicate key error
        throw new ConflictException('This rule already exists.');
      }
      // Log unexpected errors
      console.error('Error saving rule:', error);
      // Throw a generic internal server error
      throw new InternalServerErrorException('An error occurred while saving the rule.');
    }
  }

  combineRules(rules: string[], operator: string): Node {
    // Deduplication: Use a Set to store unique rules
    const uniqueRules = Array.from(new Set(rules));
  
    const astNodes: Node[] = uniqueRules.map(rule => this.createAST(rule));
  
    // Heuristic: balance the tree by frequency of operator
    if (astNodes.length === 0) {
      return null;
    }
    if (astNodes.length === 1) {
      return astNodes[0]; // If only one rule, return its AST directly
    }
  
    // Combine the rules into a single AST using the provided operator
    const combinedAST = this.buildBalancedTree(astNodes, operator);
    return combinedAST;
  }
  
  buildBalancedTree(nodes: Node[], operator: string): Node {
    // If there’s only one node, return it as it is
    if (nodes.length === 1) {
      return nodes[0];
    }
  
    // Strategy: split the array of nodes in half to minimize depth
    const mid = Math.floor(nodes.length / 2);
    const leftSubtree = this.buildBalancedTree(nodes.slice(0, mid), operator);
    const rightSubtree = this.buildBalancedTree(nodes.slice(mid), operator);
  
    // Combine the two subtrees with the operator
    return new Node('operator', leftSubtree, rightSubtree, operator);
  }


  // Evaluate the rule based on the AST and provided data
  evaluateRule(ast: Node, data: Record<string, any>): boolean {
    switch (ast.type) {
      case 'operator':
        return this.evaluateOperator(ast, data);
      case 'operand':
        return this.evaluateOperand(ast.value, data);
      default:
        throw new Error(`Unknown AST node type: ${ast.type}`);
    }
  }

  // Evaluate operators
  evaluateOperator(operator: Node, data: Record<string, any>): boolean {
    const leftValue = this.evaluateRule(operator.left, data);
    const rightValue = this.evaluateRule(operator.right, data);

    switch (operator.value) {
      case 'AND':
        return leftValue && rightValue;
      case 'OR':
        return leftValue || rightValue;
      case '>':
        return leftValue > rightValue;
      case '<':
        return leftValue < rightValue;
      case '<=':
        return leftValue <= rightValue;
      case '>=':
        return leftValue >= rightValue;
      case '!=':
        return leftValue != rightValue;
      case '=':
        return leftValue === rightValue;
      default:
        throw new Error(`Unknown operator: ${operator.value}`);
    }
  }

  // Evaluate operands
  evaluateOperand(operand: string, data: Record<string, any>): any {
    // Handle special case for string values (remove single quotes)
    if (operand.startsWith("'") && operand.endsWith("'")) {
      return operand.slice(1, -1); // Remove the single quotes
    }

    // Check if the operand is a number (string) or a key in the data
    const isNumeric = !isNaN(Number(operand));
    if (isNumeric) {
      return Number(operand); // Convert numeric strings to numbers
    }

    const value = data[operand];
    if (value === undefined) {
      throw new Error(`Undefined data for operand: ${operand}`);
    }

    return value;
  }


  // to fetch stored rules from db
  async getAllRules(): Promise<Rule[]> {
    return await this.ruleModel.find().exec(); // Fetch all existing rules
  }


  // Update rule logic
  async updateRule(id: string, updateRuleDto: any): Promise<Rule> {
    // Retrieve the rule string from the update DTO
    const { rule } = updateRuleDto;

    if (!rule) {
      throw new ConflictException('The rule string must be provided for the update.');
    }

    // Re-generate the AST based on the new rule string
    const ast = this.createAST(rule);

    // Update the rule document with the new rule string and the re-generated AST
    const updatedRule = await this.ruleModel.findByIdAndUpdate(
      id,
      { rule, ast }, // Update both rule and its new AST
      { new: true }  // Return the updated rule
    );

    if (!updatedRule) {
      throw new NotFoundException('Rule not found');
    }

    return updatedRule;
  }


  // Delete rule logic
  async deleteRule(id: string): Promise<any> {
    const result = await this.ruleModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Rule not found');
    }
    return { message: 'Rule deleted successfully' };
  }

}
