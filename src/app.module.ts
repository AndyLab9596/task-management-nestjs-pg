import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/tasks.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123qweasd',
      database: 'task-management',
      synchronize: true,
      entities: [Task, User],
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
