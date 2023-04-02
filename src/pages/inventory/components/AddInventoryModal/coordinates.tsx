/* eslint-disable @typescript-eslint/no-explicit-any */

import Moveable from 'react-moveable';
import './moveable.scss';
import styles from './addInventoryModal.module.scss';
import { useRef, useState, createElement, useEffect } from 'react';
import { Button } from '../../../../components/button';
import { AiFillBoxPlot, AiOutlineLeft } from 'react-icons/ai';
import { generateString } from '../../../../functions/randomizer';
type PropsType = {
  submitHandler: () => void;
  formData: any;
  setCoords: (coords: any) => void;
  setIsShowCoord: (type: boolean) => void;
};

export const Coordinates: React.FC<PropsType> = ({
  submitHandler,
  formData,
  setCoords,
  setIsShowCoord,
}) => {
  const image = useRef<any>();
  const [target, setTarget] = useState<any>('');
  const [allBox, setAllBox] = useState<any>([]);
  const createCoord = (e: any) => {
    if (e && target === '') {
      const target = e.target.getBoundingClientRect();
      const id = generateString();
      setAllBox([...allBox, { x: e.clientX - target.x, y: e.clientY - target.y, id: id }]);
    } else {
      setTarget('');
    }

    console.log(allBox);
  };
  useEffect(() => {
    if (allBox.length > 0) {
      setTarget(document.getElementById(allBox[allBox.length - 1].id));
    }
  }, [allBox]);

  const changeTarget = (currentTarget: any) => {
    const buf: any = document.querySelectorAll('.coordinates')[0];
    console.log(buf.style);
    if (target !== '') {
      setTarget('');
    } else {
      console.log(currentTarget);
      setTarget(currentTarget);
    }
  };

  const onChangeSize = (width: string, height: string, transform: string) => {
    const proportionWidth = image.current.naturalWidth / image.current.width;
    const proportionHeight = image.current.naturalHeight / image.current.height;
    const bufWidth = Number(width.replace(/px/gi, ''));
    const bufHeight = Number(height.replace(/px/gi, ''));
    const bufTrans = transform.replace(/[^\d,-]/g, '').split(',');
    const bufTransWidth = Number(bufTrans[0]);
    const bufTransHeight = Number(bufTrans[1]);
    setCoords({
      x1: bufTransWidth * proportionWidth,
      y1: bufTransHeight * proportionHeight,
      x2: bufWidth * proportionWidth + bufTransWidth * proportionWidth,
      y2: bufHeight * proportionHeight + bufTransHeight * proportionHeight,
    });
  };
  return (
    <div className={styles.modalCoordContainer}>
      <div className={styles.area}>
        <div className={styles.back} onClick={() => setIsShowCoord(false)}>
          <AiOutlineLeft /> Back
        </div>
        <div className={styles.image_container}>
          <img
            ref={image}
            src={
              process.env.REACT_APP_ENV === 'proxy'
                ? `${process.env.REACT_APP_NGROK}images/${formData.camera}/snapshot.jpg`
                : process.env.REACT_APP_ENV === 'wify'
                ? `${process.env.REACT_APP_IP_SERVER}images/${formData.camera}/snapshot.jpg`
                : `http://${window.location.hostname}/images/${formData.camera}/snapshot.jpg`
            }
            onClick={(e) => createCoord(e)}
          />
          {allBox.map((el: any) => (
            <div
              id={el.id}
              className={'coordinates'}
              style={{ left: el.x, top: el.y }}
              onClick={(e) => changeTarget(e.target)}
              key={el.id}
            ></div>
          ))}
        </div>
        <Moveable
          target={target}
          draggable={true}
          resizable={true}
          throttleDrag={0}
          throttleResize={0}
          throttleRotate={0}
          keepRatio={false}
          origin={false}
          edge={true}
          onDragEnd={({ target }: any) => {
            onChangeSize(target.style.width, target.style.height, target.style.transform);
          }}
          onResizeEnd={({ target }: any) => {
            onChangeSize(target.style.width, target.style.height, target.style.transform);
          }}
          onDrag={(e: any) => {
            e.target.style.transform = e.transform;
          }}
          onResize={(e: any) => {
            const beforeTranslate = e.drag.beforeTranslate;
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
          }}
        />
      </div>
      <div className={styles.footer}>{formData.name}</div>
      <div className={styles.footer}>Camera: {formData.camera}</div>
      <Button text="Save" className={styles.button} type="button" onClick={submitHandler} />
    </div>
  );
};
