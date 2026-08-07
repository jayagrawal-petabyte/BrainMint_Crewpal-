import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('projects/:projectId')
  async getProjectReport(
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const report =
      await this.reportsService.getProjectReport(projectId);

    return {
      success: true,
      message: 'Project report generated successfully',
      data: report,
    };
  }

  @Get('sprints/:sprintId')
  async getSprintReport(
    @Param('sprintId', ParseIntPipe) sprintId: number,
  ) {
    const report =
      await this.reportsService.getSprintReport(sprintId);

    return {
      success: true,
      message: 'Sprint report generated successfully',
      data: report,
    };
  }
}