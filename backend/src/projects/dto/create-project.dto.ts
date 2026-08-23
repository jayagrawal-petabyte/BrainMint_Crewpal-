import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum ProjectStatus {
  ON_TRACK = 'on_track',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  ACTIVE = 'active',
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ARCHIVED = 'archived',
}

export class CreateProjectDto {
  @IsInt()
  organizationId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
