import { Role } from '../../common/constants/roles.constant';
import { IsInt } from 'class-validator';

export class UpdateProjectMemberDto {
  @IsInt()
  roleId: Role;
}
