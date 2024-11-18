import React from 'react';
import { Permission } from '../../models/types/permission';

type PermissionContextType = {
    isAllowedTo: (permission: Permission) => boolean;
}

const defaultBehaviour: PermissionContextType = {
    isAllowedTo: () => false
}

const PermissionContext = React.createContext<PermissionContextType>( defaultBehaviour);

export default PermissionContext;