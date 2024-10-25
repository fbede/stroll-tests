import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionsController } from './controllers/questions.controller';
import { QuestionsService } from './services/questions.service';
import { AssignedQuestionService } from './services/assigned-questions.service';
import { AssignedQuestionsController } from './controllers/assigned-questions.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Question])],
    controllers: [QuestionsController, AssignedQuestionsController],
    providers: [QuestionsService, AssignedQuestionService],
})
export class QuestionsModule {}
