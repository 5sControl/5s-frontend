/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef, useState } from 'react';

import { generateString } from '../../../../functions/randomizer';
import { Coordinat, DrawingCoordinates, NewCoordinates } from '../../types';
import { IoIosCloseCircle } from 'react-icons/io';
import Moveable from 'react-moveable';
import { ZoomOut } from '../../../../components/zoomOut';
import styles from '../InventoryModal.module.scss';
type PropsType = {
  image: string;
  cameraBox: any;
  coords: any;
  setCoordToScale: (coords: Coordinat[]) => void;
  itemName: string;
  setIsScale: () => void;
};

export const Scaleble: React.FC<PropsType> = ({
  image,
  cameraBox,
  coords,
  setCoordToScale,
  itemName,
  setIsScale,
}) => {
  const [target, setTarget] = useState<any>('');
  const [proportionWidth, setProportionWidth] = useState(0);
  const [proportionHeight, setProportionHeight] = useState(0);
  const [oldCoord, setOldCoord] = useState<Coordinat[]>([]);
  const [isStartDraw, setIsStartDraw] = useState<any>(false);
  const [allBox, setAllBox] = useState<NewCoordinates[]>([]);
  const imageRef = useRef<any>();
  const [moveDraw, setMoveDraw] = useState<DrawingCoordinates>({ x: 0, y: 0 });

  const handleImageLoad = () => {
    setProportionWidth(imageRef.current.naturalWidth / imageRef.current.width);
    setProportionHeight(imageRef.current.naturalHeight / imageRef.current.height);
  };

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
    if (target.id.length === 10) {
      setAllBox(allBox.filter((el: NewCoordinates) => el.id !== target.id));
    } else {
      setOldCoord(oldCoord.filter((el: Coordinat) => el.id !== target.id));
    }
    setTarget('');
  };

  const createCoord = (e: any) => {
    if (e && !target) {
      // const target = e.target.getBoundingClientRect();
      // const id = generateString();
      // setAllBox([...allBox, { x: e.clientX - target.x, y: e.clientY - target.y, id: id }]);
    } else {
      setTarget(null);
    }
  };

  const startPosition = (e: any) => {
    if (e && !target) {
      const target = e.target.getBoundingClientRect();
      setIsStartDraw({ x: e.clientX - target.x, y: e.clientY - target.y });
      setMoveDraw({ x: e.clientX - target.x, y: e.clientY - target.y });
    }
  };

  const handlerClose = () => {
    const coordinatesLayout: any = document.querySelectorAll('.coordinatesScale');

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
    setCoordToScale(sendCoord);
    setIsScale();
  };

  const onChangeSize = () => {
    const coordinatesLayout: any = document.querySelectorAll('.coordinatesScale');
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
  };

  const changeTarget = (currentTarget: any) => {
    if (target) {
      setTarget(null);
    } else {
      setTarget(currentTarget);
    }
  };
  const endPosition = (e: any) => {
    if (e && !target) {
      const response = {
        x:
          moveDraw.x - isStartDraw.x > 0
            ? isStartDraw.x
            : isStartDraw.x - Math.abs(moveDraw.x - isStartDraw.x),
        y:
          moveDraw.y - isStartDraw.y > 0
            ? isStartDraw.y
            : isStartDraw.y - Math.abs(moveDraw.y - isStartDraw.y),
        width: Math.abs(moveDraw.x - isStartDraw.x),
        height: Math.abs(moveDraw.y - isStartDraw.y),
        id: generateString(),
      };

      setAllBox([...allBox, response]);
      setIsStartDraw(false);
      setMoveDraw({ x: 0, y: 0 });
    }
  };

  const movePosition = (e: any) => {
    if (e && !target && isStartDraw) {
      const target = e.target.getBoundingClientRect();
      if (e.clientX - target.x < 0) {
        setMoveDraw(isStartDraw);
        setIsStartDraw({ x: e.clientX - target.x, y: e.clientY - target.y });
      }
      setMoveDraw({ x: e.clientX - target.x, y: e.clientY - target.y });
    }
  };

  useEffect(() => {
    if (allBox.length > 0) {
      setTarget(document.getElementById(allBox[allBox.length - 1].id));
    }
  }, [allBox]);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => (e.key === 'Escape' ? handlerClose() : null);
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [image]);

  return (
    <section className={styles.scaleble}>
      <div className={styles.scaleble__area}>
        <div className={styles.scaleble__container}>
          <img src={image} ref={imageRef} onLoad={handleImageLoad} />
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
          {allBox.map((el: NewCoordinates) => (
            <div
              id={el.id}
              className={
                target && target.id === el.id
                  ? 'coordinatesScale coordSelected'
                  : 'coordinatesScale'
              }
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                zIndex: isStartDraw ? 1 : 1001,
              }}
              onClick={(e) => changeTarget(e.target)}
              key={el.id}
            >
              {target && target.id === el.id && (
                <IoIosCloseCircle className={styles.remove} onClick={removeCoord} />
              )}
            </div>
          ))}
          {oldCoord.length > 0 &&
            oldCoord.map((element: Coordinat) => (
              <div
                key={element.id}
                className={
                  target && target.id === element.id
                    ? 'coordinatesScale coordSelected'
                    : 'coordinatesScale'
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
          {isStartDraw && (
            <div
              className={styles.newCoordinates}
              style={{
                left:
                  moveDraw.x - isStartDraw.x > 0
                    ? isStartDraw.x
                    : isStartDraw.x - Math.abs(moveDraw.x - isStartDraw.x),
                top:
                  moveDraw.y - isStartDraw.y > 0
                    ? isStartDraw.y
                    : isStartDraw.y - Math.abs(moveDraw.y - isStartDraw.y),
                width: Math.abs(moveDraw.x - isStartDraw.x),
                height: Math.abs(moveDraw.y - isStartDraw.y),
                zIndex: 1,
              }}
            ></div>
          )}
          <div
            className={styles.draw}
            onClick={(e) => createCoord(e)}
            onMouseDown={(e) => startPosition(e)}
            onMouseMove={(e) => movePosition(e)}
            onMouseUp={(e) => endPosition(e)}
            style={
              target ? { zIndex: 100, cursor: 'pointer' } : { zIndex: 1000, cursor: 'crosshair' }
            }
          ></div>
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
          <ZoomOut onClick={handlerClose} className={styles.scaleble__close} />
        </div>
      </div>
    </section>
  );
};
