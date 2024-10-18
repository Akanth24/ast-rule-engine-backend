import { IsString } from 'class-validator';

export class RuleDto {
  @IsString()
  rule: string;
}
