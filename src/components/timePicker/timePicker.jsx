import React from 'react';
import styles from './timePicker.module.scss';

export const TimePicker = ({ id, label, value, onValueChange }) => {
    return (
        <div className={styles.timePicker}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            <input className={styles.input} id={id} type="time" value={value} onChange={onValueChange} />
        </div>
    );
};
