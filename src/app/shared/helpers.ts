export enum Role {
  User = 'User',
  Admin = 'Admin'
}

export interface UniqueId {
  uid: string,
  system_string: string,
}

export interface UserRegistration {
  username: string;
  password: string;
  role: Role
  firstName?: string;
  lastName?: string;
}

export interface BaseUser extends UserRegistration {
  id: number;
}

export interface User extends BaseUser {
  refresh_token: {
    token: string;
    update_date: Date;
  }
  access_token: string;
}

export interface UserWithPassword extends BaseUser {
  password: string;
}

export const checkAccessUrl = "http://127.0.0.1:8000/protected-access/"
