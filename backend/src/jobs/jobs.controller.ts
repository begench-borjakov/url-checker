import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobsService } from './jobs.service';
import { CreateJobRto } from './rto/create-job.rto';
import { JobDetailsRto } from './rto/job-details.rto';
import { JobSummaryRto } from './rto/job-summary.rto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() dto: CreateJobDto): CreateJobRto {
    return this.jobsService.create({ urls: dto.urls });
  }

  @Get()
  findAll(): JobSummaryRto[] {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): JobDetailsRto {
    return this.jobsService.findById(id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string): JobDetailsRto {
    return this.jobsService.cancel(id);
  }
}
