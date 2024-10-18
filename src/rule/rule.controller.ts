import { Controller, Post, Body, ConflictException, HttpException, HttpStatus, ValidationPipe, Get, Put, Param, Delete } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleDto } from './dto/rule.dto';
import { Rule } from './models/rule.schema';
import { CombineRulesDto } from './dto/combine-rules.dto';
import { EvaluateRuleDto } from './dto/evaluate-rule.dto';

@Controller('rule')
export class RuleController {
    constructor(private readonly ruleService: RuleService) { }

    // Endpoint for creating AST 
    @Post('create')
    async createRule(@Body(new ValidationPipe()) ruleDto: RuleDto): Promise<Rule> {
        try {
            return await this.ruleService.saveRule(ruleDto.rule);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw new HttpException('An error occurred while saving the rule.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Endpoint for combine rules
    @Post('combine')
    async combineRules(@Body(new ValidationPipe()) body: CombineRulesDto) {
      try {
        const combinedAST = this.ruleService.combineRules(body.rules, body.operator);
        return { combinedAST };
      } catch (error) {
        throw new HttpException('Failed to combine rules.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    // Endpoint for evaluate rules
    @Post('evaluate')
    async evaluateRule(@Body(new ValidationPipe()) body: EvaluateRuleDto) {
      try {
        const result = this.ruleService.evaluateRule(body.ast, body.data);
        return { result };
      } catch (error) {
        // Log the actual error message for debugging
        console.error('Error evaluating rule:', error.message);
  
        // Throw a detailed HTTP exception with the specific error
        throw new HttpException(
          { message: error.message || 'Failed to evaluate the rule.' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }


    // Endpoint for fetching existing rules from db
    @Get('existing')
    async getExistingRules(): Promise<Rule[]> {
        try {
            return await this.ruleService.getAllRules(); // Create this method in your service
        } catch (error) {
            throw new HttpException('Failed to fetch existing rules.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    async updateRule(@Param('id') id: string, @Body() updateRuleDto: any) {
        return await this.ruleService.updateRule(id, updateRuleDto);
    }

    @Delete(':id')
    async deleteRule(@Param('id') id: string) {
        return await this.ruleService.deleteRule(id);
    }
  
}
