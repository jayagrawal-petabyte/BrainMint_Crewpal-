import {IsBoolean,IsEmail,IsInt,IsOptional,IsString} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  organizationId?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}