import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsProcessor } from './jobs.processor';
import { JobsRepository } from './jobs.repository';
import { JobsService } from './jobs.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, JobsRepository, JobsProcessor],
})
export class JobsModule {}
