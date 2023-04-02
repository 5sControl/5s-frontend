/* eslint-disable @typescript-eslint/no-explicit-any */
import Moveable from 'react-moveable';
import styles from './editInventoryModal.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../components/button';
import { AiOutlineLeft } from 'react-icons/ai';
import './moveable.scss';
import { generateString } from '../../../../functions/randomizer';

type PropsType = {
  submitHandler: () => void;
  formData: any;
  setCoords: (coords: any) => void;
  setIsShowCoord: (type: boolean) => void;
  coordinates: any;
};

export const Coordinates: React.FC<PropsType> = ({
  submitHandler,
  formData,
  setCoords,
  coordinates,
  setIsShowCoord,
}) => {
  const image = useRef<any>();
  const [target, setTarget] = useState<any>('');
  const [proportionWidth, setProportionWidth] = useState(1);
  const [proportionHeight, setProportionHeight] = useState(1);
  const [allBox, setAllBox] = useState<any>([]);

  const changeTarget = (currentTarget: any) => {
    if (target !== '') {
      setTarget('');
    } else {
      console.log(currentTarget);
      setTarget(currentTarget);
    }
  };

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

  const timer = setInterval(() => {
    if (image.current && image.current.naturalWidth) {
      setProportionWidth(image.current.naturalWidth / image.current.width);
      setProportionHeight(image.current.naturalHeight / image.current.height);
      clearInterval(timer);
    }
  }, 200);

  useEffect(() => {
    setCoords(coordinates);
  }, []);

  const onChangeSize = () => {
    const coordinatesLayout: any = document.querySelectorAll('.coordinates');

    const proportionWidth = image.current.naturalWidth / image.current.width;
    const proportionHeight = image.current.naturalHeight / image.current.height;

    const sendCoord: any[] = [];
    coordinatesLayout.forEach((element: any) => {
      const bufLeft = Number(element.style.left.replace(/px/gi, ''));
      const bufTop = Number(element.style.top.replace(/px/gi, ''));
      const bufWidth = Number(element.style.width.replace(/px/gi, ''));
      const bufHeight = Number(element.style.height.replace(/px/gi, ''));
      const bufTrans = element.style.transform.replace(/[^\d,-]/g, '').split(',');
      const bufTransWidth = Number(bufTrans[0]) || 0;
      const bufTransHeight = Number(bufTrans[1]) || 0;
      const totalX = bufTransWidth + bufLeft;
      const totalY = bufTransHeight + bufTop;
      console.log(bufTransHeight);
      sendCoord.push({
        x1: totalX * proportionWidth,
        y1: totalY * proportionHeight,
        x2: bufWidth * proportionWidth + totalX * proportionWidth,
        y2: bufHeight * proportionHeight + totalY * proportionHeight,
      });
    });
    console.log(sendCoord);
    setCoords(sendCoord);
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
          {console.log(coordinates)}
          {coordinates &&
            coordinates.map((element: any, index: number) => (
              <div
                key={index}
                className={'coordinates'}
                style={{
                  top: `${element?.y1 / proportionHeight}px`,
                  left: `${element?.x1 / proportionWidth}px`,
                  width: `${(element?.x2 - element?.x1) / proportionHeight}px`,
                  height: `${(element?.y2 - element?.y1) / proportionWidth}px`,
                }}
                onClick={(e) => changeTarget(e.target)}
              ></div>
            ))}
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
          onDragEnd={onChangeSize}
          onResizeEnd={onChangeSize}
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
