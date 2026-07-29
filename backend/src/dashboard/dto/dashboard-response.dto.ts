import { DashboardData } from '../interfaces/dashboard.interface';

export class DashboardResponseDto {
  success: boolean;
  message: string;
  data: DashboardData;
}