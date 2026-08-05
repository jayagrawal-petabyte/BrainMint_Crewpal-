/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Role } from '../common/constants/roles.constant';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
  )
  create(@Body() dto: CreateProjectDto, @Req() req: any) {
    return this.projectsService.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.projectsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.projectsService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    @Req() req: any,
  ) {
    return this.projectsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.ORG_ADMIN,
    Role.PROJECT_ADMIN,
    Role.PROJECT_MANAGER,
  )
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.projectsService.deactivate(id, req.user);
  }
}
