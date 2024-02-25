import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column()
  password: string;
  @Column()
  email: string;

  @Column({ default: true })
  status: boolean;
  @Column({ nullable: true })
  refresh_token?: string;
  @CreateDateColumn()
  create_at: Date;
  @CreateDateColumn()
  update_at: Date;
}
