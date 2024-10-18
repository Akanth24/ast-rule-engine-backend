import { Module } from '@nestjs/common';
import { RuleModule } from './rule/rule.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/rule-engine'), // Update with your MongoDB connection string
    RuleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
