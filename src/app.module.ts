import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from './questions/questions.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    QuestionsModule,
],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
