import React, { useMemo } from 'react';
import { Permission } from '../../models/types/permission';
import PermissionContext from "./PermissionContext";
import { fetchPermission } from './fetchPermission';
import rolesPermissions from '../../constants/rolesPermissions';

type PermissionProviderProps = {
    role: string;
    children: React.ReactNode;
};

const PermissionProvider: React.FC<PermissionProviderProps> = ({ role, children }) => {
    const isAllowedTo = (permission: string): boolean => {
        return rolesPermissions[role]?.includes(permission) || false;
    };

    const value = useMemo(() => ({ isAllowedTo }), [role]);

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};

export default PermissionProvider;