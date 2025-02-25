import { ROLE } from "../enums/roles.enum"
import { IWorkplace } from "./workplace.interface"

export interface IEmployee {
  id: number,
  name: string
}

export interface IUser {
  id: number,
  date_joined: string,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  role: ROLE,
  password: string,
  workplace: IWorkplace
}

export interface IAddUser {
  username: string,
  email: string,
  first_name?: string,
  last_name?: string,
  role: ROLE,
  password: string,
  workplace?: number
}

export interface IUpdateUser {
  username?: string,
  first_name?: string,
  last_name?: string,
  role?: ROLE,
  password?: string,
  workplace_id?: number
}