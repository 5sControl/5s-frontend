/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './selectBase.module.scss';

type PropsType = {
  listOfData: Array<{ id: number | string; text: string }>;
  id: string;
  name: string;
  label?: string;
  className?: string;
  activeSelect?: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCurrentSelect?: (select: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  camerasData?: any;
  setDefaultSelect?: (select: any) => void;
  disabled?: boolean;
};

export const SelectBase: React.FC<PropsType> = ({
  listOfData,
  id,
  label,
  name,
  className,
  activeSelect,
  setCurrentSelect,
  camerasData,
  setDefaultSelect,
  disabled,
}) => {
  const [dataSelect, setDataSelect] = useState<string>();
  const handleOnChangeSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    setDataSelect(e.target.value);
  };

  useEffect(() => {
    if (!listOfData.length) {
      setDataSelect('');
      return;
    }
    if (activeSelect) {
      const activeSelectItem: any = listOfData.filter((item) => item.id === activeSelect);
      setDataSelect(activeSelectItem[0]?.text);
    } else {
      setDataSelect(listOfData[0].text);
    }
  }, []);

  useEffect(() => {
    if (dataSelect && setCurrentSelect && camerasData) {
      setCurrentSelect(camerasData.filter((el: any) => el.text === dataSelect)[0].id);
    }
  }, [dataSelect]);

  useEffect(() => {
    if (setDefaultSelect && dataSelect) {
      setDefaultSelect(
        listOfData.filter((el: { id: number | string; text: string }) => el.text === dataSelect)[0]
          .id
      );
    }
  }, [dataSelect]);

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
