// users/dto/create-user.dto.ts
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail() email: string;
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one uppercase letter, one digit, and one special character',
  })
  password: string;
  @IsString() @IsNotEmpty() name: string;
  @IsInt() @Min(1) organizationId: number;
  @IsInt() @Min(1) @Max(9) roleId: number;
}
