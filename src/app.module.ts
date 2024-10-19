import { Module } from '@nestjs/common';
import { RuleModule } from './rule/rule.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config/config.service';

const configService = ConfigService.getInstance();
const mongoURI = configService.get('MONGO_URI');


@Module({
  imports: [
    MongooseModule.forRoot(mongoURI),
    RuleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
