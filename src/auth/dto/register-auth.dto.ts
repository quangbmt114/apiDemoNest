export class RegisterAuthDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  status: boolean;
  refresh_token?: string;
  create_at: Date;
  update_at: Date;
}
