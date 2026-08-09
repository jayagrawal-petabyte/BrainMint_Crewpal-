import { Role } from '../constants/roles.constant';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role_id: Role;
  organization_id: number;
}
