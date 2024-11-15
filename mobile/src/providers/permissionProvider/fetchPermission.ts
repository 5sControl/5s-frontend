import rolesPermissions from "../../constants/rolesPermissions";

export const fetchPermission = (role: string, permission: string): boolean => {
    return rolesPermissions[role]?.includes(permission) || false;
};
