import React, { ChangeEvent, useRef } from 'react';
import { EditCover } from '../../../../assets/svg/SVGcomponent';
import style from './cover.module.scss';

export type SelectImagePropsType = {
  setLogo: (logo: File | string | null) => void;
};

export const SelectImage: React.FC<SelectImagePropsType> = ({ setLogo }) => {
  const inpFile = useRef<HTMLInputElement | null>(null);

  const clearInputContent = () => {
    if (inpFile.current) {
      inpFile.current.value = '';
    }
  };

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      setLogo(file);
      clearInputContent();
    }
  };

  return (
    <>
      <label className={style.editCoverLabel}>
        <input
          ref={inpFile}
          type="file"
          onClick={clearInputContent}
          onChange={uploadHandler}
          style={{ display: 'none' }}
        />
        <EditCover />
      </label>
    </>
  );
};
