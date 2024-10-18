import { IsNotEmpty, IsObject } from 'class-validator';

export class EvaluateRuleDto {
  @IsObject()
  @IsNotEmpty()
  ast: any; // AST structure should be an object

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>; // User data should be a dictionary/object
}
