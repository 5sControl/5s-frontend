/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState, useEffect, Fragment } from 'react';
import Moveable from 'react-moveable';
import { IoIosCloseCircle } from 'react-icons/io';
import { generateString } from '../../../../../functions/randomizer';
import { Coordinat, DrawingCoordinates, NewCoordinates } from '../../../types';
import { Scale } from '../../../../../components/scale';
import { Scaleble } from '../../../../inventory/components/EditInventoryModal/scale';

import './moveable.scss';
import styles from './zonesCoordinat.module.scss';
import { FourPointsNewCoordinates } from '../../../../inventory/types';

type PropsType = {
  setCoords: (coords: any) => void;
  currentSelect: string;
  itemName: string;
  isScale: any;
  setIsScale: (coords: any) => void;
  cameraBox: any;
  oldBox: any;
  currentZoneId: number;
  createZoneMode: boolean;
  handleSaveError: boolean;
  setValidZone: (status: boolean) => void;
  isFourPointsMode: boolean;
};

export const ZonesCoordinates: React.FC<PropsType> = ({
  setCoords,
  currentSelect,
  itemName,
  isScale,
  setIsScale,
  cameraBox,
  oldBox,
  currentZoneId,
  createZoneMode,
  handleSaveError,
  setValidZone,
  isFourPointsMode,
}) => {
  const image = useRef<any>();
  const [target, setTarget] = useState<any>(null);
  const [allBox, setAllBox] = useState<Array<NewCoordinates | FourPointsNewCoordinates>>([]);
  const [isStartDraw, setIsStartDraw] = useState<any>(false);
  const [moveDraw, setMoveDraw] = useState<DrawingCoordinates>({ x: 0, y: 0 });
  const [proportionWidth, setProportionWidth] = useState(0);
  const [proportionHeight, setProportionHeight] = useState(0);
  const [coordToScale, setCoordToScale] = useState<any[]>([]);
  const moveableRef = useRef<Moveable>(null);
  const [validCoords, setValidCoords] = useState({ x: 1, y: 1, width: 100, height: 100 });
  const [fourPointsCoordinates, setFourPointsCoordinates] = useState<any[]>([]);
  const [zone, setZone] = useState<any[]>([]);

  useEffect(() => {
    if (oldBox.length > 0) {
      console.log('oldBox', oldBox);
      const old = JSON.parse(JSON.stringify(oldBox))
        .map((el: any) => el.coords)[0]
        .map((coord: any) => {
          if (coord.zoneType === 4) {
            return {
              zoneType: coord.zoneType,
              x1: coord.x1 / proportionWidth,
              y1: coord.y1 / proportionHeight,
              x2: coord.x2 / proportionWidth,
              y2: coord.y2 / proportionHeight,
              x3: coord.x3 / proportionWidth,
              y3: coord.y3 / proportionHeight,
              x4: coord.x4 / proportionWidth,
              y4: coord.y4 / proportionHeight,
              id: generateString(11),
            }
          }
          else{
            return {
              zoneType: coord.zoneType,
              x: coord.x1 / proportionWidth,
              y: coord.y1 / proportionHeight,
              width: (coord.x2 - coord.x1) / proportionWidth,
              height: (coord.y2 - coord.y1) / proportionHeight,
              id: generateString(11),
            };
          }
        });
      setAllBox(old);
      console.log(old)
    } else {
      setAllBox([]);
    }
  }, [currentZoneId]);

  const createCoord = (e: any) => {
    if (e && !target) {
      const target = e.target.getBoundingClientRect();
      if (fourPointsCoordinates.length >= 4) {
        setFourPointsCoordinates([]);
      } else {
        setFourPointsCoordinates((prev) => [
          ...prev,
          { x: e.clientX - target.x, y: e.clientY - target.y },
        ]);
      }
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
      console.log('allBox', allBox);
      if (allBox.length > 0) {
        setTarget(document.getElementById(allBox[allBox.length - 1].id));
      } else {
        setTarget(null);
      }
      onChangeSize();
    }
  }, [allBox, proportionWidth]);

  useEffect(() => {
    if (!isFourPointsMode) {
      setFourPointsCoordinates([]);
    }

  }, [isFourPointsMode]);



  useEffect(() => {
    if (isFourPointsMode && fourPointsCoordinates.length === 4) {
      const newCoords = fourPointsCoordinates
        .map((el, index) => {
          return {
            [`x${index + 1}`]: el.x * proportionWidth,
            [`y${index + 1}`]: el.y * proportionHeight,
          };
        })
        .reduce((acc, el) => {
          return { ...acc, ...el };
        }, {});

      const response = {
        x1: newCoords.x1 / proportionWidth,
        x2: newCoords.x2 / proportionWidth,
        x3: newCoords.x3 / proportionWidth,
        x4: newCoords.x4 / proportionWidth,
        y1: newCoords.y1 / proportionHeight,
        y2: newCoords.y2 / proportionHeight,
        y3: newCoords.y3 / proportionHeight,
        y4: newCoords.y4 / proportionHeight,
        id: generateString(),
      } as FourPointsNewCoordinates;
      setAllBox([...allBox, response]);
      setCoords([newCoords]);

    }

  }, [fourPointsCoordinates]);


  const removeCoord = () => {
    setAllBox(allBox.filter((el: NewCoordinates | FourPointsNewCoordinates) => el.id !== target.id));
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

      if (!isFourPointsMode) {
        sendCoord.push({
          x1: totalX * proportionWidth,
          y1: totalY * proportionHeight,
          x2: bufWidth * proportionWidth + totalX * proportionWidth,
          y2: bufHeight * proportionHeight + totalY * proportionHeight,
        });
        setCoords(sendCoord);
      }
    });
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
    <div className={styles.zones__left}>
      <div className={styles.area}>
        <div className={styles.image_container}>
          <img
            ref={image}
            className={styles.image_container_img}
            onLoad={handleImageLoad}
            src={`${process.env.REACT_APP_NGROK}images/${currentSelect}/snapshot.jpg`}
          />
          {fourPointsCoordinates.length !== 0 && isFourPointsMode && (
            <svg
              className={styles.newCoordinates}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0px',
                left: '0px',
              }}
              onClick={(e) => changeTarget(e.target)}
            >
              {fourPointsCoordinates.map((el, i) => {
                return <circle key={i} cx={`${el.x}`} cy={`${el.y}`} r={'5'} fill={'white'} />;
              })}
              {fourPointsCoordinates.length === 4 && (
                <polygon
                  fill={'rgba(255, 123, 41, 0.5)'}

                  points={`${fourPointsCoordinates[0].x},${fourPointsCoordinates[0].y} ${fourPointsCoordinates[1].x},${fourPointsCoordinates[1].y} ${fourPointsCoordinates[2].x},${fourPointsCoordinates[2].y}, ${fourPointsCoordinates[3].x},${fourPointsCoordinates[3].y}`}
                />
              )}
            </svg>
          )}
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
                )
            )}
         {allBox.map((el: NewCoordinates | FourPointsNewCoordinates) => {
            if (Object.keys(el).includes('x')) {
              const element = el as NewCoordinates;
              return (
                <div
                  id={el.id}
                  className={
                    target && target.id === el.id ? 'coordinates coordSelected' : 'coordinates'
                  }
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
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
              );
            } else {
              const element = el as FourPointsNewCoordinates;
              return (
                <div 
                  key={element.id}
                  onClick={(e) => changeTarget(e.target)}>
                <svg
                  style={{
                    zIndex: isStartDraw ? 1 : 1001,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                  }}
                >
                  <polygon
                    stroke={'#fe6100'}
                    strokeWidth={1}
                    fill={'rgba(255, 123, 41, 0.5)'}
                    points={`${element.x1},${element.y1} ${element.x2},${element.y2} ${element.x3},${element.y3} ${element.x4},${element.y4}`}
                  />
                  <text
                    style={{ fontSize: 8, fill: 'white' }}
                    x={element.x1 + 4}
                    y={element.y1 + 12}
                  >
                    {itemName}
                  </text>
                </svg>
                {
                  console.log('target', target)
                }
                {target && target.id === element.id && (
                  <IoIosCloseCircle className={styles.remove} onClick={removeCoord} />
                )}
                </div>
              );
            }
          })}

             {!!cameraBox &&
                !!proportionWidth &&
                !!proportionHeight &&
                cameraBox.length > 0 &&
                cameraBox.map((el: any) => {
                    const coord = el.coords[0];
                    return (
                        <Fragment key={el.id}>
                            {coord.zoneType === 4 ? (
                                <svg
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: '0px',
                                        left: '0px',
                                    }}
                                >
                                  <polygon 
                                    fill={'rgba(33, 33, 33, 0.6)'}
                                    stroke={'#666666'}
                                    points={`${coord.x1 / proportionWidth},${coord.y1 / proportionHeight} ${coord.x2 / proportionWidth},${coord.y2 / proportionHeight} ${coord.x3 / proportionWidth},${coord.y3 / proportionHeight}, ${coord.x4 / proportionWidth},${coord.y4 / proportionHeight}`}
                                  />
                                  <text
                                    style={{ fontSize: 8, fill: 'white' }}
                                    x={(coord.x1 + 4) / proportionWidth}
                                    y={(coord.y1 + 12) / proportionHeight}
                                  >
                                  {el.name}
                                  </text>
                                </svg>
                            ) : (
                                el.coords.map((element: any) => (
                                    <div
                                        key={generateString(14)}
                                        className={styles.oldCoord}
                                        style={{
                                            top: `${element?.y1 / proportionHeight}px`,
                                            left: `${element?.x1 / proportionWidth}px`,
                                            width: `${(element?.x2 - element?.x1) / proportionWidth}px`,
                                            height: `${(element?.y2 - element?.y1) / proportionHeight}px`,
                                            zIndex: 1,
                                        }}
                                    >
                                        {el.name}
                                    </div>
                                ))
                            )}
                        </Fragment>
                    );
                })}
          <div
            className={styles.draw}
            onClick={(e) => isFourPointsMode && createCoord(e)}
            onMouseDown={(e) => !isFourPointsMode && startPosition(e)}
            onMouseMove={(e) => !isFourPointsMode && movePosition(e)}
            onMouseUp={(e) => !isFourPointsMode && endPosition(e)}
            style={
              target ? { zIndex: 100, cursor: 'pointer' } : { zIndex: 1000, cursor: 'crosshair' }
            }
          ></div>
          {!!proportionHeight && (
            <div className={styles.scale} style={{ zIndex: isStartDraw ? 1 : 2001 }}>
              <Scale
                onClick={() =>
                  scaleHandler(`${process.env.REACT_APP_NGROK}images/${currentSelect}/snapshot.jpg`)
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
      </div>
    </div>
  );
};
