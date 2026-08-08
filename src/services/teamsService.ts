import { apiRequest } from "./apiClient";


export interface BackendUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  organization_id: number;
  is_active: boolean;
}

export const teamsService = {

  async getUsers(): Promise<any> {
    return apiRequest<any>("/users");
  },

  async addUser(data:any) {
    return apiRequest<any>("/users", {
      method:"POST",
      body:data,
    });
  },

  async updateUser(
  id:string,
  data:any
){
  return apiRequest<any>(
    `/users/${id}`,
    {
      method:"PATCH",
      body:data,
    }
  );
},

  async deactivateUser(id:number) {
    return apiRequest(
      `/users/${id}/deactivate`,
      {
        method:"PATCH",
      }
    );
  },

};