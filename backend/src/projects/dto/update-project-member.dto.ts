import { IsEnum } from 'class-validator';
import { Role } from '../../common/constants/roles.constant';

export class UpdateProjectMemberDto {
  @IsEnum(Role)
  roleId: Role;
}
