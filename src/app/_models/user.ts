import { Role } from './role';
export class User{
    email:string;
    password:string;
    name:string;
    role:Role;
    token?:string;
    manu?:number;
}