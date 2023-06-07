/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState, useEffect, Fragment } from 'react';
import Moveable from 'react-moveable';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { IoIosCloseCircle } from 'react-icons/io';
import { generateString } from '../../../../functions/randomizer';
import { Coordinat, DrawingCoordinates, NewCoordinates } from '../../types';
import { getInventoryItemsToCamera } from '../../inventoryAPI';
import { Scale } from '../../../../components/scale';
import { Scaleble } from './scale';

import './moveable.scss';
import styles from '../InventoryModal.module.scss';
type PropsType = {
  submitHandler: () => void;
  setCoords: (coords: Coordinat[]) => void;
  currentSelect: string;
  handleClose: () => void;
  itemName: string;
  isScale: any;
  setIsScale: (coords: any) => void;
};

export const Coordinates: React.FC<PropsType> = ({
  submitHandler,
  setCoords,
  currentSelect,
  handleClose,
  itemName,
  isScale,
  setIsScale,
}) => {
  const image = useRef<any>();
  const [target, setTarget] = useState<any>(null);
  const [allBox, setAllBox] = useState<NewCoordinates[]>([]);
  const [cameraBox, setCameraBox] = useState<any>([]);
  const [isStartDraw, setIsStartDraw] = useState<any>(false);
  const [moveDraw, setMoveDraw] = useState<DrawingCoordinates>({ x: 0, y: 0 });
  const [cookie] = useCookies(['token']);
  const [proportionWidth, setProportionWidth] = useState(0);
  const [proportionHeight, setProportionHeight] = useState(0);

  const [coordToScale, setCoordToScale] = useState<any[]>([]);

  const createCoord = (e: any) => {
    if (e && !target) {
      // const target = e.target.getBoundingClientRect();
      // const id = generateString();
      // setAllBox([...allBox, { x: e.clientX - target.x, y: e.clientY - target.y, id: id }]);
    } else {
      setTarget(null);
    }
  };
  useEffect(() => {
    if (coordToScale.length > 0 && !isScale) {
      const proportionWidth = image.current.naturalWidth / image.current.width;
      const proportionHeight = image.current.naturalHeight / image.current.height;
      const bufCoord = coordToScale.map((element: any) => {
        return {
          y: element?.y1 / proportionHeight,
          x: element?.x1 / proportionWidth,
          width: (element?.x2 - element?.x1) / proportionHeight,
          height: (element?.y2 - element?.y1) / proportionWidth,
          id: generateString(10),
        };
      });
      setAllBox(bufCoord);
    }
  }, [isScale]);

  const startPosition = (e: any) => {
    if (e && !target) {
      const target = e.target.getBoundingClientRect();
      setIsStartDraw({ x: e.clientX - target.x, y: e.clientY - target.y });
      setMoveDraw({ x: e.clientX - target.x, y: e.clientY - target.y });
    }
  };
  const handleImageLoad = () => {
    setProportionWidth(image.current.naturalWidth / image.current.width);
    setProportionHeight(image.current.naturalHeight / image.current.height);
  };

  useEffect(() => {
    if (currentSelect.length > 0) {
      getInventoryItemsToCamera(window.location.hostname, cookie.token, currentSelect)
        .then((res: any) => {
          setCameraBox(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentSelect]);

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
    } else {
      // setTarget(null);
    }
  };

  useEffect(() => {
    if (proportionWidth) {
      if (allBox.length > 0) {
        setTarget(document.getElementById(allBox[allBox.length - 1].id));
      }
      onChangeSize();
    }
  }, [allBox, proportionWidth]);

  const removeCoord = () => {
    setAllBox(allBox.filter((el: NewCoordinates) => el.id !== target.id));
    setTarget('');
  };

  const changeTarget = (currentTarget: any) => {
    if (target) {
      setTarget(null);
    } else {
      setTarget(currentTarget);
    }
  };

  const onChangeSize = () => {
    const coordinatesLayout: any = document.querySelectorAll('.coordinates');

    const proportionWidth = image.current.naturalWidth / image.current.width;
    const proportionHeight = image.current.naturalHeight / image.current.height;

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
  const scaleHandler = (img: string) => {
    const coordinatesLayout: any = document.querySelectorAll('.coordinates');

    const proportionWidth = image.current.naturalWidth / image.current.width;
    const proportionHeight = image.current.naturalHeight / image.current.height;

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
    setIsScale(img);
  };
  return (
    <div className={styles.modalCoordContainer}>
      <div className={styles.area}>
        <div className={styles.image_container}>
          <img
            ref={image}
            className={styles.image_container_img}
            onLoad={handleImageLoad}
            src={
              process.env.REACT_APP_ENV === 'proxy'
                ? `${process.env.REACT_APP_NGROK}images/${currentSelect}/snapshot.jpg`
                : process.env.REACT_APP_ENV === 'wify'
                ? `${process.env.REACT_APP_IP_SERVER}images/${currentSelect}/snapshot.jpg`
                : `http://${window.location.hostname}/images/${currentSelect}/snapshot.jpg`
            }
          />
          {allBox.map((el: NewCoordinates) => (
            <div
              id={el.id}
              className={
                target && target.id === el.id ? 'coordinates coordSelected' : 'coordinates'
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
              {itemName}
              {target && target.id === el.id && (
                <IoIosCloseCircle className={styles.remove} onClick={removeCoord} />
              )}
            </div>
          ))}
          {!!cameraBox &&
            !!proportionWidth &&
            !!proportionHeight &&
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
          {!!proportionHeight && (
            <div className={styles.scale} style={{ zIndex: isStartDraw ? 1 : 2001 }}>
              <Scale
                onClick={() =>
                  scaleHandler(
                    process.env.REACT_APP_ENV === 'proxy'
                      ? `${process.env.REACT_APP_NGROK}images/${currentSelect}/snapshot.jpg`
                      : process.env.REACT_APP_ENV === 'wify'
                      ? `${process.env.REACT_APP_IP_SERVER}images/${currentSelect}/snapshot.jpg`
                      : `http://${window.location.hostname}/images/${currentSelect}/snapshot.jpg`
                  )
                }
              />
            </div>
          )}

          {isScale && (
            <Scaleble
              image={isScale}
              cameraBox={cameraBox}
              coords={coordToScale}
              itemName={itemName}
              setIsScale={() => setIsScale(false)}
              setCoordToScale={(coord) => setCoordToScale(coord)}
            />
          )}
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
      <div className={styles.footer}>
        <h2 className={styles.footer__text}>
          Select the area to track <span>*</span>
        </h2>
        <Button
          text="Cancel"
          className={styles.button_cancel}
          type="button"
          onClick={handleClose}
        />
        <Button
          text="Done"
          className={styles.button}
          type="button"
          onClick={submitHandler}
          disabled={allBox.length === 0}
        />
      </div>
    </div>
  );
};
