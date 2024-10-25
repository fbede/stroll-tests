import { BadRequestException, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignedQuestionService } from '../services/assigned-questions.service';
import { Regions } from 'src/enums';

@ApiTags('Assigned Questions')
@Controller('assigned-questions')
export class AssignedQuestionsController {
    constructor(private readonly assignedQuestionService: AssignedQuestionService){}

    @Patch(':interval')
    create(@Param('interval') interval: number){
        return this.assignedQuestionService.updateInterval(interval);
    }

    @Get(':region')
    async get(@Param('region') region: Regions){
        return this.assignedQuestionService.getQuestion(region).catch(
            err => {throw new BadRequestException(err)}
        )
    }
}
