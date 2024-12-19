import { useState, useRef, Fragment } from 'react';
import { CameraTest } from '../testConection/cameraTest';
import { generateString } from '../../../../functions/randomizer';

import styles from './right.module.scss';
export const RightSection = ({
  isCreateCamera,
  cameraSelect,
  userName,
  password,
  workplace,
  zoneId,
}) => {
  const image = useRef(null);
  const [proportionWidth, setProportionWidth] = useState(0);
  const [proportionHeight, setProportionHeight] = useState(0);

  const handleImageLoad = () => {
    setProportionWidth(image.current.naturalWidth / image.current.width);
    setProportionHeight(image.current.naturalHeight / image.current.height);
  };
  return (
    <div className="cameras__settings_right">
      {!isCreateCamera ? (
        <div className={styles.image_container}>
          <img
            ref={image}
            className={styles.img}
            onLoad={handleImageLoad}
            src={`${process.env.REACT_APP_NGROK}images/${cameraSelect.id}/snapshot.jpg`}
            alt=""
          />
          {!!workplace &&
            !!proportionWidth &&
            !!proportionHeight &&
            workplace.length > 0 &&
            workplace.map((el) => {
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
                    el.coords.map((element) => (
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
        </div>
      ) : (
        <CameraTest cameraIP={cameraSelect.id} userName={userName} password={password} />
      )}
    </div>
  );
};
