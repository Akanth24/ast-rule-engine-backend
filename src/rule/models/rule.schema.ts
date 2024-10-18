import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Node } from './node.model';

// Create a Rule document interface
export interface Rule extends Document {
  rule: string;
  ast: Node | any; // Reference to the AST structure; you can replace 'any' with a specific type
}

// Define the Rule schema
@Schema()
export class RuleSchema {
  @Prop({ required: true, unique: true }) // Ensure the rule is unique
  rule: string;

  @Prop({ required: true, type: SchemaTypes.Mixed }) // Use Mixed type for dynamic structure
  ast: Node; // Can also be defined as any or a more specific type if known
}

// Create the Mongoose model using the schema
export const RuleModel = SchemaFactory.createForClass(RuleSchema);
