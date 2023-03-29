import React, { ChangeEvent, useState } from 'react';
import { ArrowBottom } from '../../assets/svg/SVGcomponent';
import styles from './selectBase.module.scss';

type PropsType = {
  listOfData: Array<{ id: number; text: string }>;
  id: string;
  name: string;
  label?: string;
  className?: string;
  activeSelect?: number;
};

export const SelectBase: React.FC<PropsType> = ({
  listOfData,
  id,
  label,
  name,
  className,
  activeSelect,
}) => {
  const [dataSelect, setDataSelect] = useState<string>(
    activeSelect ? listOfData[activeSelect].text : listOfData[0].text
  );

  const handleOnChangeSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    setDataSelect(e.target.value);
  };

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.block}>
        <select
          name={name}
          id={id}
          value={dataSelect}
          onChange={handleOnChangeSelection}
          className={`${styles.block__select} ${className}`}
        >
          {listOfData.map((item) => (
            <option key={item.id} value={item.text} className={styles.block__option}>
              {item.text}
            </option>
          ))}
        </select>

        <ArrowBottom className={styles.block__arrow} />
      </div>
    </div>
  );
};
