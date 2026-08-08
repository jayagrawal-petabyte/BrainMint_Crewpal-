import { IsEnum, IsInt, Min } from 'class-validator';
import { Role } from '../../common/constants/roles.constant';

export class AddProjectMemberDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsEnum(Role)
  roleId: Role;
}
