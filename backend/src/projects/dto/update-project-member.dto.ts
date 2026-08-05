import { IsInt } from 'class-validator';

export class UpdateProjectMemberDto {
  @IsInt()
  roleId: Role;
}
