// users/users.controller.ts
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() create(@Body() dto: CreateUserDto) { return this.usersService.create(dto); }

  @Get() findAll(@Query('organizationId') organizationId?: string) {
    return this.usersService.findAll(organizationId ? Number(organizationId) : undefined);
  }

  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.usersService.findOne(id); }

  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/deactivate') deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/role') updateRole(@Param('id', ParseIntPipe) id: number, @Body('roleId', ParseIntPipe) roleId: number) {
    return this.usersService.updateRole(id, roleId);
  }
}