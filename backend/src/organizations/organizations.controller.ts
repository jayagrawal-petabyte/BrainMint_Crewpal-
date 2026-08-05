import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../common/constants/roles.constant';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateOrganizationSettingsDto } from './dto/create-organization-settings.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpdateOrganizationSettingsDto } from './dto/update-organization-settings.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: CreateOrganizationDto) {
    return this.orgService.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.orgService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.orgService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizationDto,
    @Req() req: any,
  ) {
    return this.orgService.update(id, dto, req.user);
  }

  @Patch(':id/deactivate')
  @Roles(Role.SUPER_ADMIN)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.orgService.deactivate(id);
  }

  @Get(':id/settings')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  getSettings(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.orgService.getSettings(id, req.user);
  }

  @Put(':id/settings')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  upsertSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizationSettingsDto | CreateOrganizationSettingsDto,
    @Req() req: any,
  ) {
    return this.orgService.upsertSettings(id, dto, req.user);
  }

  @Patch(':organizationId/users/:userId/role')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  updateUserRole(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserRoleDto,
    @Req() req: any,
  ) {
    return this.orgService.updateUserRole(organizationId, userId, dto, req.user);
  }
}
