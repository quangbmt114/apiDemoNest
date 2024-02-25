import { IsNotEmpty } from 'class-validator';

export class UpdateUserAuthDto {
  @IsNotEmpty()
  first_name: string;
  @IsNotEmpty()
  last_name: string;
  status: boolean;
}
