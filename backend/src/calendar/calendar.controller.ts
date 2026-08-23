import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Controller(['calendar', 'events'])
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  async getCalendarEvents(
    @Query('projectId') projectId: string,
    @Query('month') month: string,
    @Query('year') year: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    const parsedProjectId = projectId ? parseInt(projectId, 10) : undefined;
    const parsedMonth = month ? parseInt(month, 10) : undefined;
    const parsedYear = year ? parseInt(year, 10) : undefined;

    return this.calendarService.getEvents(req.user, {
      projectId: parsedProjectId,
      month: parsedMonth,
      year: parsedYear,
    });
  }

  @Get('events')
  async getEventsAlias(
    @Query('projectId') projectId: string,
    @Query('month') month: string,
    @Query('year') year: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.getCalendarEvents(projectId, month, year, req);
  }
}
