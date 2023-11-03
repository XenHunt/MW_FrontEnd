export enum Role{
    User = 'User',
    Admin = 'Admin'
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    role: Role;
    jwtToken?: string;
}