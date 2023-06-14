import React, { ChangeEvent, useRef } from 'react';
import { EditCover } from '../../../../assets/svg/SVGcomponent';
import style from './cover.module.scss';

export type SelectImagePropsType = {
  setCover: (coverImg: File) => void;
};

export const SelectImage: React.FC<SelectImagePropsType> = ({ setCover }) => {
  const inpFile = useRef<HTMLInputElement | null>(null);

  const clearInputContent = () => {
    if (inpFile.current) {
      inpFile.current.value = '';
    }
  };

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];

      if (file.size < 5000000) {
        setCover(file);
      }
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
