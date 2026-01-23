import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../../../entities/Task.entity';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}