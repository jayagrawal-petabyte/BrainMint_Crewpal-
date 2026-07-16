// users/dto/create-user.dto.ts
import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() @IsNotEmpty() name: string;
  @IsInt() organizationId: number;
  @IsInt() roleId: number;
}