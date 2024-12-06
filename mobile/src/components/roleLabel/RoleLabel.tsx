import React from 'react';
import './RoleLabel.scss'
import { ROLE } from '../../models/enums/roles.enum';

type RoleLabelProps = {
    role: ROLE
}

const RoleLabel: React.FC<RoleLabelProps>  = ({role}) =>{
    
    return (
        <span className={`
            ${role === ROLE.ADMIN ? 'statusAdmin' : 
            role === ROLE.SUPERUSER ? 'statusSuperuser' : 
            'statusWorker'} status`}>
            {role}
        </span>
    )
        
}
export default RoleLabel;