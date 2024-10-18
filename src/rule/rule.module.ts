import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { RuleSchema, RuleModel } from './models/rule.schema'; // Import both

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RuleSchema.name, schema: RuleModel }]), // Use RuleModel here
  ],
  controllers: [RuleController],
  providers: [RuleService],
})
export class RuleModule {}
