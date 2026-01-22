import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { Task } from './Task.entity';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Index({ unique: true })
    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @OneToMany(() => Task, (task) => task.user)
    tasks!: Task[];

    @Column({ nullable: true, select: false })
    refreshToken?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
