import { IsArray, IsString, IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export class CombineRulesDto {
  @IsArray()                // Validates that 'rules' is an array
  @ArrayNotEmpty()           // Ensures that the array is not empty
  @IsString({ each: true })   // Validates that each item in the 'rules' array is a string
  rules: string[];

  @IsString()               // Validates that 'operator' is a string
  @IsNotEmpty()             // Ensures that 'operator' is not empty
  operator: string;
}
