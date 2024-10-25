import { BadRequestException, Body, Controller, Delete, Get, Param, ParseArrayPipe, Post } from '@nestjs/common';
import { QuestionsService } from '../services/questions.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService){}

    @ApiBody({type: String, isArray: true})
    @Post()
    async create(@Body(new ParseArrayPipe({ items: String })) body: string[]){
        return this.questionsService.addAll(body).catch(
            (err) => {throw new BadRequestException(err);}
        )   
    }

    @Get()
    async getAll(){
        return this.questionsService.findAll().catch(
            (err) => {throw new BadRequestException(err);}
        )  
    }

    @Get(':id')
    async getOne(@Param('id') id: number){
        return this.questionsService.findOne(id).catch(
            (err) => {throw new BadRequestException(err);}
        )  
    }

    @Delete(':id')
    async delete(@Param('id') id: number){
        return this.questionsService.remove(id).catch(
            (err) => {throw new BadRequestException(err);}
        )  
    }
}
