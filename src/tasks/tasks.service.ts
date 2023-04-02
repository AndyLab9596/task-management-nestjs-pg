import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async getAllTasks(user: User): Promise<Task[]> {
    const tasks = await this.tasksRepository.findBy({ user });
    return tasks;
  }

  async getTaskByFilter(
    { status, search }: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder();
    query.where({ user });

    if (status) {
      query.andWhere('status = :status', { status });
    }

    if (search) {
      query.andWhere('(title LIKE :search OR description LIKE :search)', {
        search: `%${search}%`,
      });
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const foundTask = await this.tasksRepository.findOneBy({ id, user });

    if (!foundTask) throw new NotFoundException();

    return foundTask;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const newTask = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.user = user;
    await this.tasksRepository.save(newTask);
    return newTask;
  }

  async updateTaskStatus(
    id: string,
    { status }: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    await this.tasksRepository
      .createQueryBuilder()
      .update(Task)
      .set({ status })
      .where('id = :id', { id })
      .execute();
    const updatedTask = await this.getTaskById(id, user);
    return updatedTask;
  }

  async deleteTask(id: string, user: User): Promise<DeleteResult> {
    const res = await this.tasksRepository.delete({ id, user });
    if (res.affected === 0) {
      throw new NotFoundException();
    }
    return res;
  }
}
