import { ROLE } from "../enums/roles.enum"

export interface IEmployee {
  id: number,
  name: string
}

export interface IUser {
  id: number,
  date_joined: string,
  username: string,
  first_name: string,
  last_name: string,
  role: ROLE,
  password: string,
  workplace: any
}

export interface IAddUser {
  username: string,
  first_name?: string,
  last_name?: string,
  role: ROLE,
  password: string,
  workplace?: any
}