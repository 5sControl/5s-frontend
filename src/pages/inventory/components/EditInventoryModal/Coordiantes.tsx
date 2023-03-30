/* eslint-disable @typescript-eslint/no-explicit-any */
import Moveable from 'react-moveable';
import styles from './editInventoryModal.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../components/button';

type PropsType = {
  submitHandler: () => void;
  formData: any;
  setCoords: (coords: any) => void;
  coordinates: any;
};

export const Coordinates: React.FC<PropsType> = ({
  submitHandler,
  formData,
  setCoords,
  coordinates,
}) => {
  const image = useRef<any>();
  const coord = useRef<any>();
  const [target, setTarget] = useState<any>('');
  const [proportionWidth, setProportionWidth] = useState(1);
  const [proportionHeight, setProportionHeight] = useState(1);
  const changeTarget = (currentTarget: any, where: string) => {
    if (where === 'image' && target !== '') {
      setTarget('');
    } else {
      setTarget(currentTarget);
    }
  };
  const timer = setInterval(() => {
    if (image.current && image.current.naturalWidth) {
      setProportionWidth(image.current.naturalWidth / image.current.width);
      setProportionHeight(image.current.naturalHeight / image.current.height);
      clearInterval(timer);
    }
  }, 100);

  useEffect(() => {
    console.log(coordinates);
    setCoords(coordinates[0]);
  }, []);

  const onChangeSize = (width: string, height: string, transform: string) => {
    const proportionWidth = image.current.naturalWidth / image.current.width;
    const proportionHeight = image.current.naturalHeight / image.current.height;
    const bufWidth = Number(width.replace(/px/gi, ''));
    const bufHeight = Number(height.replace(/px/gi, ''));
    const bufTrans = transform.replace(/[^\d,-]/g, '').split(',');
    const bufTransWidth = Number(bufTrans[0]);
    const bufTransHeight = Number(bufTrans[1]);
    console.log(bufWidth, 'image width');
    console.log(bufHeight, 'image width');
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
      x1: bufTransWidth * proportionWidth + coordinates[0].x1,
      y1: bufTransHeight * proportionHeight + coordinates[0].y1,
      x2: bufWidth * proportionWidth + bufTransWidth * proportionWidth,
      y2: bufHeight * proportionHeight + bufTransHeight * proportionHeight,
    });
  };
  return (
    <div className={styles.modalCoordContainer}>
      <div className={styles.area}>
        <img
          ref={image}
          src={
            process.env.REACT_APP_ENV === 'proxy'
              ? `${process.env.REACT_APP_NGROK}images/${formData.camera}/snapshot.jpg`
              : process.env.REACT_APP_ENV === 'wify'
              ? `${process.env.REACT_APP_IP_SERVER}images/${formData.camera}/snapshot.jpg`
              : `http://${window.location.hostname}/images/${formData.camera}/snapshot.jpg`
          }
          onClick={() => changeTarget(coord, 'image')}
        />
        <div
          ref={coord}
          className={styles.coord}
          style={{
            top: `${coordinates[0]?.y1 / proportionHeight}px`,
            left: `${coordinates[0]?.x1 / proportionWidth}px`,
            width: `${(coordinates[0]?.x2 - coordinates[0]?.x1) / proportionHeight}px`,
            height: `${(coordinates[0]?.y2 - coordinates[0]?.y1) / proportionWidth}px`,
          }}
          onClick={() => changeTarget(coord, 'coord')}
        ></div>
        <Moveable
          target={target}
          container={image?.current}
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
      <div className={styles.footer} onClick={() => changeTarget('', 'button')}>
        {formData.name}
      </div>
      <div className={styles.footer} onClick={() => changeTarget('', 'button')}>
        Camera: {formData.camera}
      </div>
      <Button text="Save" className={styles.button} type="button" onClick={submitHandler} />
    </div>
  );
};
