import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getAllTask(
    @Query() getTaskFilterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    if (Object.keys(getTaskFilterDto).length > 0) {
      return this.tasksService.getTaskByFilter(getTaskFilterDto, user);
    }
    return this.tasksService.getAllTasks(user);
  }

  @Get('/:taskId')
  async getTaskById(
    @Param('taskId') taskId: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:taskId/status')
  async updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const updatedTask = await this.tasksService.updateTaskStatus(
      taskId,
      updateTaskStatusDto,
      user,
    );
    return updatedTask;
  }

  @Delete('/:taskId')
  async deleteTask(@Param('taskId') taskId: string, @GetUser() user: User) {
    await this.tasksService.deleteTask(taskId, user);
  }
}
