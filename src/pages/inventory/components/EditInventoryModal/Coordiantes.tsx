/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef, useState } from 'react';
import Moveable from 'react-moveable';
import { IoIosCloseCircle } from 'react-icons/io';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';

import { generateString } from '../../../../functions/randomizer';
import { Coordinat, DrawingCoordinates, NewCoordinates } from '../../types';
import { getInventoryItemsToCamera } from '../../inventoryAPI';
import { Scale } from '../../../../components/scale';
import { Scaleble } from './scale';

import './moveable.scss';
import styles from '../InventoryModal.module.scss';
import { getCameraZones } from '../../../../api/cameraRequest';
type PropsType = {
  submitHandler: () => void;
  setCoords: (coords: Coordinat[]) => void;
  coordinates: Coordinat[] | undefined;
  currentSelect: string;
  itemName: any;
  handleClose: () => void;
  isScale: any;
  setIsScale: (coords: any) => void;
  token: string;
};

export const Coordinates: React.FC<PropsType> = ({
  submitHandler,
  setCoords,
  coordinates,
  currentSelect,
  itemName,
  handleClose,
  isScale,
  setIsScale,
  token,
}) => {
  const image = useRef<any>();
  const [target, setTarget] = useState<any>('');
  const [proportionWidth, setProportionWidth] = useState(0);
  const [proportionHeight, setProportionHeight] = useState(0);
  const [allBox, setAllBox] = useState<NewCoordinates[]>([]);
  const [oldBox, setOldBox] = useState<Coordinat[]>([]);
  const [cookie] = useCookies(['token']);
  const [isStartDraw, setIsStartDraw] = useState<any>(false);
  const [moveDraw, setMoveDraw] = useState<DrawingCoordinates>({ x: 0, y: 0 });
  const [cameraBox, setCameraBox] = useState<any>([]);
  const [coordToScale, setCoordToScale] = useState<any[]>([]);
  const [zone, setZone] = useState<any[]>([]);
  useEffect(() => {
    if (proportionHeight > 0 && proportionHeight > 0) {
      getCameraZones(window.location.hostname, token, currentSelect)
        .then((res) => {
          if (res && res.data && res.data.length > 0) {
            const bufCoord = res.data.map((element: any) => {
              return {
                y: element?.coords[0]?.y1 / proportionHeight,
                x: element?.coords[0]?.x1 / proportionWidth,
                width: (element?.coords[0]?.x2 - element?.coords[0]?.x1) / proportionHeight,
                height: (element?.coords[0]?.y2 - element?.coords[0]?.y1) / proportionWidth,
                id: element.id,
                name: element.name,
              };
            });
            setZone(bufCoord);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentSelect, proportionHeight, proportionWidth]);

  const changeTarget = (currentTarget: any) => {
    if (target !== '') {
      setTarget('');
    } else {
      setTarget(currentTarget);
    }
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
    }
  };

  useEffect(() => {
    if (allBox.length > 0) {
      setTarget(document.getElementById(allBox[allBox.length - 1].id));
    }
    onChangeSize();
  }, [allBox]);

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
      setOldBox([]);
    }
  }, [isScale]);

  useEffect(() => {
    if (currentSelect.length > 0) {
      getInventoryItemsToCamera(window.location.hostname, cookie.token, currentSelect)
        .then((res: any) => {
          setCameraBox(res.data.filter((el: any) => el.name !== itemName));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentSelect]);

  const removeCoord = () => {
    if (target.id.length > 10) {
      setOldBox(oldBox.filter((el: Coordinat) => el.id !== target.id));
    } else {
      setAllBox(allBox.filter((el: NewCoordinates) => el.id !== target.id));
    }
    setTarget('');
  };
  const handleImageLoad = () => {
    setProportionWidth(image.current.naturalWidth / image.current.width);
    setProportionHeight(image.current.naturalHeight / image.current.height);
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

  useEffect(() => {
    if (coordinates) {
      setOldBox(
        coordinates.map((el: Coordinat) => {
          return {
            ...el,
            id: generateString(11),
          };
        })
      );
    }
  }, []);

  useEffect(() => {
    if (proportionWidth) {
      if (allBox.length > 0) {
        setTarget(document.getElementById(allBox[allBox.length - 1].id));
      }
    }
  }, [allBox, proportionWidth]);

  useEffect(() => {
    if (proportionWidth) {
      if (oldBox.length > 0) {
        setCoords(oldBox);
      }
    }
  }, [oldBox, proportionWidth]);

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
  return (
    <div className={styles.modalCoordContainer}>
      <div className={styles.area}>
        <div className={styles.image_container}>
          <img
            ref={image}
            className={styles.image_container_img}
            onLoad={handleImageLoad}
            src={`${process.env.REACT_APP_NGROK}images/${currentSelect}/snapshot.jpg`}
            onClick={(e) => createCoord(e)}
          />
          {zone.length > 0 &&
            zone.map((el) => (
              <div
                id={el.id}
                className={'coordinatesZone'}
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
                {el.name}
              </div>
            ))}
          {oldBox.length > 0 &&
            !!proportionWidth &&
            oldBox.map((element: Coordinat) => (
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
            cameraBox.length > 0 &&
            !!proportionWidth &&
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
          {!!proportionWidth && (
            <div className={styles.scale} style={{ zIndex: isStartDraw ? 1 : 2001 }}>
              <Scale
                onClick={() =>
                  scaleHandler(`${process.env.REACT_APP_NGROK}images/${currentSelect}/snapshot.jpg`)
                }
              />
            </div>
          )}

          {!!isScale && (
            <Scaleble
              image={isScale}
              cameraBox={cameraBox}
              coords={coordToScale}
              itemName={itemName}
              setIsScale={() => setIsScale(false)}
              setCoordToScale={(coord) => setCoordToScale(coord)}
            />
          )}
          {!!isStartDraw && (
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
          disabled={allBox.length + oldBox.length === 0}
        />
      </div>
    </div>
  );
};
