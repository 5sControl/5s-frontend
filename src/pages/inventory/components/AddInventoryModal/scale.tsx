/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef, useState } from 'react';
import styles from './addInventoryModal.module.scss';
import { generateString } from '../../../../functions/randomizer';
import { Coordinat, NewCoordinates } from '../../types';
import { IoIosCloseCircle } from 'react-icons/io';
import Moveable from 'react-moveable';
type PropsType = {
  image: string;
  cameraBox: any;
  coords: any;
  setCoords: (coords: Coordinat[]) => void;
  itemName: string;
};

export const Scaleble: React.FC<PropsType> = ({
  image,
  cameraBox,
  coords,
  setCoords,
  itemName,
}) => {
  const [target, setTarget] = useState<any>('');
  const [proportionWidth, setProportionWidth] = useState(1);
  const [proportionHeight, setProportionHeight] = useState(1);
  const [oldCoord, setOldCoord] = useState<Coordinat[]>([]);
  const [isStartDraw, setIsStartDraw] = useState<any>(false);
  const [allBox, setAllBox] = useState<NewCoordinates[]>([]);
  const imageRef = useRef<any>();

  const timer = setInterval(() => {
    if (imageRef.current && imageRef.current.naturalWidth) {
      setProportionWidth(imageRef.current.naturalWidth / imageRef.current.width);
      setProportionHeight(imageRef.current.naturalHeight / imageRef.current.height);
      clearInterval(timer);
    }
  }, 200);

  useEffect(() => {
    if (coords) {
      setOldCoord(
        coords.map((el: Coordinat) => {
          return {
            ...el,
            id: generateString(11),
          };
        })
      );
    }
  }, []);

  const removeCoord = () => {
    setAllBox(allBox.filter((el: NewCoordinates) => el.id !== target.id));
    setTarget('');
  };

  const onChangeSize = () => {
    const coordinatesLayout: any = document.querySelectorAll('.coordinates');
    const proportionWidth = imageRef.current.naturalWidth / imageRef.current.width;
    const proportionHeight = imageRef.current.naturalHeight / imageRef.current.height;

    const sendCoord: Coordinat[] = [];
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

      sendCoord.push({
        x1: totalX * proportionWidth,
        y1: totalY * proportionHeight,
        x2: bufWidth * proportionWidth + totalX * proportionWidth,
        y2: bufHeight * proportionHeight + totalY * proportionHeight,
      });
    });
    setCoords(sendCoord);
  };

  const changeTarget = (currentTarget: any) => {
    if (target) {
      setTarget(null);
    } else {
      setTarget(currentTarget);
    }
  };
  return (
    <section className={styles.scaleble}>
      <div className={styles.scaleble__area}>
        <div className={styles.scaleble__container}>
          <img src={image} ref={imageRef} />
          {cameraBox &&
            cameraBox.length > 0 &&
            cameraBox.map((el: any) => (
              <Fragment key={el.id}>
                {el.coords.map((element: any) => (
                  <div
                    key={generateString(14)}
                    className={styles.oldCoord}
                    style={{
                      top: `${element?.y1 / proportionHeight}px`,
                      left: `${element?.x1 / proportionWidth}px`,
                      width: `${(element?.x2 - element?.x1) / proportionHeight}px`,
                      height: `${(element?.y2 - element?.y1) / proportionWidth}px`,
                      zIndex: 1,
                    }}
                  >
                    {el.name}
                  </div>
                ))}
              </Fragment>
            ))}
          {oldCoord.length > 0 &&
            oldCoord.map((element: Coordinat) => (
              <div
                key={element.id}
                className={
                  target && target.id === element.id ? 'coordinates coordSelected' : 'coordinates '
                }
                id={element.id}
                style={{
                  top: `${element?.y1 / proportionHeight}px`,
                  left: `${element?.x1 / proportionWidth}px`,
                  width: `${(element?.x2 - element?.x1) / proportionHeight}px`,
                  height: `${(element?.y2 - element?.y1) / proportionWidth}px`,
                  zIndex: isStartDraw ? 1 : 1001,
                }}
                onClick={(e) => changeTarget(e.target)}
              >
                {' '}
                {itemName}
                {target && target.id === element.id && (
                  <IoIosCloseCircle className={styles.remove} onClick={removeCoord} />
                )}
              </div>
            ))}
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
      </div>
    </section>
  );
};
