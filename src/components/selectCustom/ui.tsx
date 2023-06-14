/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './selectCustom.module.scss';

type PropsType = {
  listOfData: Array<{ id: number | string; text: string }>;
  id: string;
  name: string;
  label?: string;
  className?: string;
  activeSelect?: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  camerasData?: any;
  setDefaultSelect: (select: any) => void;
  disabled?: boolean;
};

export const SelectCustom: React.FC<PropsType> = ({
  listOfData,
  id,
  label,
  name,
  className,
  activeSelect,
  setDefaultSelect,
  disabled,
}) => {
  const [dataSelect, setDataSelect] = useState<string | null>(null);

  const handleOnChangeSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    setDefaultSelect(
      listOfData.filter(
        (el: { id: number | string; text: string }) => el.text === e.target.value
      )[0].id
    );
  };

  useEffect(() => {
    if (activeSelect) {
      const activeSelectItem: any = listOfData.filter((item) => item.id === activeSelect);
      setDataSelect(activeSelectItem[0]?.text);
    } else {
      setDefaultSelect(listOfData[0].id);
    }
  }, [activeSelect]);

  useEffect(() => {
    if (!listOfData.length) {
      setDataSelect(null);
      return;
    }
  }, []);

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
          value={dataSelect || undefined}
          onChange={handleOnChangeSelection}
          className={`${styles.block__select} ${className}`}
          disabled={disabled}
        >
          {listOfData.map((item) => (
            <option key={item.id} value={item.text} className={styles.block__option}>
              {item.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
