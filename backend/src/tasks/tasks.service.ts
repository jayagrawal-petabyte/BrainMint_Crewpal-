import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
} from './dto/create-task.dto';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  organizationId: string;
  projectId: string;
  priority?: string;
  status?: TaskStatus;
  assigneeId?: string;
  sprintId?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TasksService {
  private tasks: TaskItem[] = [];

  create(createTaskDto: CreateTaskDto): TaskItem {
    const newTask: TaskItem = {
      id: Date.now().toString(),
      ...createTaskDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  findAllByOrg(organizationId: string): TaskItem[] {
    return this.tasks.filter((t) => t.organizationId === organizationId);
  }

  findOneByOrg(id: string, organizationId: string): TaskItem {
    const task = this.tasks.find(
      (t) => t.id === id && t.organizationId === organizationId,
    );
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  update(
    id: string,
    organizationId: string,
    updateData: UpdateTaskDto,
  ): TaskItem {
    const task = this.findOneByOrg(id, organizationId);

    if (updateData.title !== undefined) task.title = updateData.title;
    if (updateData.description !== undefined) {
      task.description = updateData.description;
    }
    if (updateData.priority !== undefined) task.priority = updateData.priority;
    if (updateData.sprintId !== undefined) task.sprintId = updateData.sprintId;

    task.updatedAt = new Date();
    return task;
  }

  updateStatus(
    id: string,
    organizationId: string,
    status: TaskStatus,
  ): TaskItem {
    const task = this.findOneByOrg(id, organizationId);
    task.status = status;
    task.updatedAt = new Date();
    return task;
  }

  assignUser(id: string, organizationId: string, assigneeId: string): TaskItem {
    const task = this.findOneByOrg(id, organizationId);
    task.assigneeId = assigneeId;
    task.updatedAt = new Date();
    return task;
  }

  remove(id: string, organizationId: string): { message: string } {
    const task = this.findOneByOrg(id, organizationId);
    const index = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks.splice(index, 1);
    return { message: 'Task deleted successfully' };
  }
}
