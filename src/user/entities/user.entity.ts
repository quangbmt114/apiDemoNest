import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column({ nullable: true })
  refresh_token?: string;

  @Column({ default: true })
  status: boolean;
}
