import React from 'react';
import { Permission } from '../../models/types/permission';
import usePermission from "./usePermission";

type RestrictedProps = {
    to: Permission;
    children: React.ReactNode;
    fallback?: React.ReactNode | string;
    loadingComponent?: React.ReactNode | string;
};

const Restricted: React.FC<RestrictedProps> = ({to, fallback,loadingComponent, children}) => {
    const [loading, allowed] = usePermission(to);

    if(loading){
        return <>{loadingComponent}</>;
    }

    if(allowed){
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default Restricted;