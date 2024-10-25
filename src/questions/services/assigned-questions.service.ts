import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Regions } from 'src/enums';
import { Question } from 'src/questions/question.entity';
import { DateTime } from "luxon";
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';

@Injectable()
export class AssignedQuestionService {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        @InjectRepository(Question)
        private readonly questionsRepository: Repository<Question>,
    ){}

    private readonly logger = new Logger(AssignedQuestionService.name)
    private startDate = DateTime.fromISO("2024-10-28T19:00:00", { zone: "Asia/Singapore" });
    private intervalMs: number = 7 * 24 * 60 * 60 * 1000;

    async getQuestion(region:Regions){
        const result = await this.questionsRepository.findOne({
            where:{region}, 
            order:{lastAssigned: 'DESC'}
        });

        if (result) {
            return result;
        } else {
            throw new BadRequestException('No question found in this region. Region might be invalid.');   
        }
    }

    updateInterval(interval: number){
        this.intervalMs = interval * 24 * 60 * 60 * 1000;
    }

    @Timeout(0) 
    private async initScheduler() {
        this.logger.log('...initializing cronjob')
        const now = DateTime.now();
        const delay = this.startDate.toMillis() - now.toMillis();

        if (delay !== 0) {
            this.delayTaskSchedule(Math.abs(delay))
        } else {
            this.scheduleTask();
        }
    }


    private delayTaskSchedule(milliseconds: number) {
        const callback = async () => {
            this.logger.warn(`Timeout ${AssignedQuestionService.name} executing after (${milliseconds})!`);
            this.scheduleTask()
        };
    
        const timeout = setTimeout(callback, milliseconds);
        this.schedulerRegistry.addTimeout(AssignedQuestionService.name, timeout);
    }
  

    private scheduleTask() {
        const callback = async() => {
          this.logger.warn(`Interval ${AssignedQuestionService.name} executing at time (${this.intervalMs})!`);
          await this.assignQuestions();
        };
        const interval = setInterval(callback, this.intervalMs);
        this.schedulerRegistry.addInterval(AssignedQuestionService.name, interval);
    }

    private async assignQuestions(){
        for (const r of Object.values(Regions)) {
            const region = Regions[r]

            let question = await this.questionsRepository.findOne({
                where: {region: IsNull()}  
            })


            if (!question){
                question = await this.questionsRepository.findOne({
                    where: {region: Regions[region as keyof typeof Regions]},
                    order: {lastAssigned: 'ASC'}  
                })
            }

            if (question) {
                await this.questionsRepository.update(question.id,{
                    region,
                    lastAssigned: new Date()
                })
            }else{
                this.logger.error(`No questions for ${region} available in db`);    
            }
       }
    }
}


