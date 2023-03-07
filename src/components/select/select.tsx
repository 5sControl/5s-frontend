import React, { useState } from 'react';
import { SelectArrow } from '../../assets/svg/SVGcomponent';
import styles from './select.module.scss';

type PropsType = {
  listOfData: Array<{ id: number; text: string }>;
  className?: string;
};

export const Select: React.FC<PropsType> = ({ listOfData, className }) => {
  const [dataSelect, setDataSelect] = useState<string>(listOfData[0].text);
  return (
    <div className={styles.container}>
      <select
        value={dataSelect}
        onChange={(e) => setDataSelect(e.target.value)}
        className={`${className} ${styles.select}`}
      >
        {listOfData.map((item) => {
          return (
            <option value={item.text} key={item.id}>
              {item.text}
            </option>
          );
        })}
      </select>
      <SelectArrow />
    </div>
  );
};
