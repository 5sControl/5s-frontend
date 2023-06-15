import React, { FC, useState } from 'react';
import { AddCover, DeleteCover } from '../../../../assets/svg/SVGcomponent';
import { SelectImage } from './SelectImage';
import style from './cover.module.scss';

type Props = {
  logo: File | string | null;
  setLogo: (logo: File | string | null) => void;
};

export const SelectCover: FC<Props> = ({ logo, setLogo }) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={style.container}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={style.cover}>
        {logo ? (
          <img
            className={style.cover}
            src={typeof logo === 'string' ? logo : URL.createObjectURL(logo)}
            alt="pack cover"
          />
        ) : (
          <AddCover />
        )}
      </div>

      {isHover && (
        <>
          {logo && <DeleteCover className={style.deleteCover} onClick={() => setLogo(null)} />}

          <div className={style.editCover}>
            <SelectImage setLogo={setLogo} />
          </div>
        </>
      )}
    </div>
  );
};
