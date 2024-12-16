import {useContext, useEffect, useState} from 'react';
import PermissionContext from "./PermissionContext";
import { Permission } from '../../models/types/permission';

const usePermission = (permission: Permission) => {
    const [loading, setLoading] = useState(false);
    const [allowed, setAllowed] = useState<boolean>();
    const {isAllowedTo} = useContext(PermissionContext);

    useEffect(() => {
        const checkPermission = async () => {
            setLoading(true);
            setAllowed(isAllowedTo(permission));
            setLoading(false);
        };
        checkPermission();
    }, [isAllowedTo, permission]);
    
    return [loading, allowed]
}

export default usePermission;

