/* eslint-disable @typescript-eslint/no-unsafe-argument */
// users/users.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.constant';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.usersService.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.usersService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.usersService.update(id, dto, req.user);
  }

  @Patch(':id/deactivate')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  deactivate(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.usersService.deactivate(id, req.user);
  }

  @Patch(':id/role')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleId', ParseIntPipe) roleId: Role,
    @Req() req: any,
  ) {
    return this.usersService.updateRole(id, roleId, req.user);
  }
}
