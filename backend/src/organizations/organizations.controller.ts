 
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CreateOrganizationSettingsDto } from './dto/create-organization-settings.dto';
import { UpdateOrganizationSettingsDto } from './dto/update-organization-settings.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post() create(@Body() dto: CreateOrganizationDto) { return this.orgService.create(dto); }

  @Get() findAll() { return this.orgService.findAll(); }

  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.orgService.findOne(id); }

  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrganizationDto) {
    return this.orgService.update(id, dto);
  }

  @Patch(':id/deactivate') deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.orgService.deactivate(id);
  }

  @Get(':id/settings') getSettings(@Param('id', ParseIntPipe) id: number) {
    return this.orgService.getSettings(id);
  }

  @Put(':id/settings') upsertSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizationSettingsDto | CreateOrganizationSettingsDto,
  ) {
    return this.orgService.upsertSettings(id, dto);
  }
}
 
// organizations/organizations.controller.ts
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.constant';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: CreateOrganizationDto) { return this.orgService.create(dto); }

  @Get()
  findAll() { return this.orgService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.orgService.findOne(id); }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrganizationDto) {
    return this.orgService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @Roles(Role.SUPER_ADMIN)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.orgService.deactivate(id);
  }
}
 
