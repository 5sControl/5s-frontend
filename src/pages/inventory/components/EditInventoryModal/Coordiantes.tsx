/* eslint-disable @typescript-eslint/no-explicit-any */
import Moveable from 'react-moveable';
import styles from './editInventoryModal.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../components/button';
import { AiOutlineLeft } from 'react-icons/ai';
import './moveable.scss';
import { generateString } from '../../../../functions/randomizer';
import { IoIosCloseCircle } from 'react-icons/io';
import { EditInventoryData } from './types';
import { Coordinat, DrawingCoordinates, NewCoordinates } from '../../types';
type PropsType = {
  submitHandler: () => void;
  formData: EditInventoryData;
  setCoords: (coords: Coordinat[]) => void;
  setIsShowCoord: (type: boolean) => void;
  coordinates: Coordinat[] | undefined;
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
  const [allBox, setAllBox] = useState<NewCoordinates[]>([]);
  const [oldBox, setOldBox] = useState<Coordinat[]>([]);

  const [isStartDraw, setIsStartDraw] = useState<any>(false);
  const [moveDraw, setMoveDraw] = useState<DrawingCoordinates>({ x: 0, y: 0 });

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
      // setAllBox([...allBox, { x: e.clientX - target.x, y: e.clientY - target.y, id: id }]);
    } else {
      // setTarget(null);
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
    } else {
      // setTarget(null);
    }
  };

  useEffect(() => {
    if (allBox.length > 0) {
      setTarget(document.getElementById(allBox[allBox.length - 1].id));
    }
    onChangeSize();
  }, [allBox]);

  const removeCoord = () => {
    if (target.id.length > 10) {
      setOldBox(oldBox.filter((el: Coordinat) => el.id !== target.id));
    } else {
      setAllBox(allBox.filter((el: NewCoordinates) => el.id !== target.id));
    }
    setTarget('');
  };

  const timer = setInterval(() => {
    if (image.current && image.current.naturalWidth) {
      setProportionWidth(image.current.naturalWidth / image.current.width);
      setProportionHeight(image.current.naturalHeight / image.current.height);
      clearInterval(timer);
    }
  }, 200);

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
    console.log(allBox.length);
    if (allBox.length > 0) {
      setTarget(document.getElementById(allBox[allBox.length - 1].id));
    }
  }, [allBox]);

  useEffect(() => {
    setCoords(oldBox);
  }, [oldBox]);

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
          {oldBox.length > 0 &&
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
              {target && target.id === el.id && (
                <IoIosCloseCircle className={styles.remove} onClick={removeCoord} />
              )}
            </div>
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
        <p>Item name: {formData.name}</p>
        <p>Camera: {formData.camera}</p>
        <Button
          text="Save"
          className={styles.button}
          type="button"
          onClick={submitHandler}
          disabled={allBox.length + oldBox.length === 0}
        />
      </div>
    </div>
  );
};
