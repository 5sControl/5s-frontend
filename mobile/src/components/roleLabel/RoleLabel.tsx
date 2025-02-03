import React from 'react';
import styles from './RoleLabel.module.scss'
import { ROLE } from '../../models/enums/roles.enum';

type RoleLabelProps = {
    role: ROLE
}

const RoleLabel: React.FC<RoleLabelProps>  = ({role}) =>{
    
    return (
        <span className={`
            ${role === ROLE.ADMIN ? styles.statusAdmin : 
            role === ROLE.SUPERUSER ? styles.statusSuperuser : 
            styles.statusWorker} ${styles.status}`}>
            {role}
        </span>
    )
        
}
export default RoleLabel;