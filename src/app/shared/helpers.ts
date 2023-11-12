export enum Role {
  User = 'User',
  Admin = 'Admin'
}

export interface BaseUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
}

export interface User extends BaseUser {
  refresh_token?:string;
  access_token?:string;
}

export interface UserWithPassword extends BaseUser {
  password: string;
}
