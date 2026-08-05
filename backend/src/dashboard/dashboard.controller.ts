import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Request() req) {
    const dashboard = await this.dashboardService.getDashboard(req.user.id);

    return {
      success: true,
      message: 'Dashboard fetched successfully',
      data: dashboard,
    };
  }
}
