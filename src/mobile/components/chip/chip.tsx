import React from 'react';
import { IonChip } from "@ionic/react";
import {OPERATION_STATUS} from './../../constants/operationStatus';
import {OperationStatus} from './../../models/types/ordersStatus'
import styles from './styles.module.scss'

const Chip = ({name}: IChip) =>{
    
    return (
        <div style={{borderColor:OPERATION_STATUS[name].color }} className={styles.chip}>{OPERATION_STATUS[name].label}</div>
    )
        
}
export default Chip;

interface IChip {
    name: OperationStatus
}