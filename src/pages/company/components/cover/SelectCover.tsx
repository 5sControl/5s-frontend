import React, { FC, useState } from 'react';
import { AddCover, DeleteCover } from '../../../../assets/svg/SVGcomponent';
import { SelectImage } from './SelectImage';
import style from './cover.module.scss';

export const SelectCover: FC = () => {
  const [cover, setCover] = useState<File>();
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={style.container}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={style.cover}>
        {cover ? (
          <img className={style.cover} src={URL.createObjectURL(cover)} alt="pack cover" />
        ) : (
          <AddCover />
        )}
      </div>

      {isHover && (
        <>
          {cover && (
            <DeleteCover className={style.deleteCover} onClick={() => setCover(undefined)} />
          )}

          <div className={style.editCover}>
            <SelectImage setCover={setCover} />
          </div>
        </>
      )}
    </div>
  );
};
