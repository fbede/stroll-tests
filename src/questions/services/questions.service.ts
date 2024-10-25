import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from '../question.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question) readonly questionsRepository: Repository<Question>
    ){}

    addAll(input: string[]): Promise<any>{
        const questions = input.map(item => {
            return {text: item}
        })
        return this.questionsRepository.save(questions)
    }

    findAll(): Promise<Question[]> {
        return this.questionsRepository.find();
    }
    
    findOne(id: number): Promise<Question | null> {
        return this.questionsRepository.findOneBy({ id });
    }
    
    async remove(id: number): Promise<void> {
        await this.questionsRepository.delete(id);
    }
}
