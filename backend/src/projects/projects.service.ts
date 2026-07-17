import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  create(dto: CreateProjectDto) {
    return { message: 'Create project', dto };
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return { id };
  }

  update(id: number, dto: UpdateProjectDto) {
    return { id, dto };
  }
}