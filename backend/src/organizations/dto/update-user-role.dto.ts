import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../common/constants/roles.constant';

const VALID_ROLE_NAMES = Object.keys(Role).filter((key) => Number.isNaN(Number(key)));

export class UpdateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_ROLE_NAMES)
  role: string;
}
