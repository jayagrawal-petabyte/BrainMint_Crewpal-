// organizations/organizations.controller.ts
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

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
}