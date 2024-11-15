import { ROLE } from "../enums/roles.enum";
import { Permission } from "./permission";

export type User = {
    id: number;
    username: string;
    status: ROLE;
    date_joined: string;
    permissions?: Permission[];
}