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
  work_start_time: string,
  work_end_time: string
}

export interface IAddUser {
  username: string,
  email: string,
  first_name?: string,
  last_name?: string,
  role: ROLE,
  password: string,
  workplace?: number,
  work_start_time: string,
  work_end_time: string
}

export interface IUpdateUser {
  username?: string,
  first_name?: string,
  last_name?: string,
  role?: ROLE,
  password?: string,
  workplace_id?: number
}