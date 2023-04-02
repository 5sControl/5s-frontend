/* eslint-disable @typescript-eslint/no-explicit-any */

import Moveable from 'react-moveable';
import './moveable.scss';
import styles from './addInventoryModal.module.scss';
import { useRef, useState, createElement } from 'react';
import { Button } from '../../../../components/button';
import { AiFillBoxPlot, AiOutlineLeft } from 'react-icons/ai';

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
  const [allBox, setAllBox] = useState<any>(['sdf']);
  const createCoord = (e: any) => {
    if (e) {
      const target = e.target.getBoundingClientRect();
      console.log();
      setAllBox([...allBox, { x: e.clientX - target.x, y: e.clientY - target.y }]);
    }

    console.log(allBox);
  };
  const changeTarget = (currentTarget: any) => {
    if (target !== '') {
      console.log(target);
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
    // console.log(image.current.width, 'image width');
    // console.log(image.current.height, 'image height');
    // console.log(bufWidth, bufHeight);
    // console.log('x1, x2', bufTrans);
    // console.log('x1, y1', bufTransWidth * proportionWidth, bufTransHeight * proportionHeight);
    // console.log(
    //   'x2, y2',
    //   bufWidth * proportionWidth + bufTransWidth * proportionWidth,
    //   bufHeight * proportionHeight + bufTransHeight * proportionHeight
    // );

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
          {allBox.map((el: any, index: number) => (
            <div
              className={styles.coord}
              style={{ left: el.x, top: el.y }}
              onClick={(e) => changeTarget(e.target)}
              key={index}
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
