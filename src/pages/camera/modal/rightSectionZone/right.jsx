import { useState, useRef, Fragment } from 'react';
import { CameraTest } from '../testConection/cameraTest';
import { generateString } from '../../../../functions/randomizer';

import styles from './right.module.scss';
export const RightSection = ({
  isCreateCamera,
  cameraSelect,
  cameraIP,
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
            src={
              process.env.REACT_APP_ENV === 'proxy'
                ? `${process.env.REACT_APP_NGROK}images/${cameraSelect.id}/snapshot.jpg`
                : process.env.REACT_APP_ENV === 'wify'
                ? `${process.env.REACT_APP_IP_SERVER}images/${cameraSelect.id}/snapshot.jpg`
                : `http://${window.location.hostname}/images/${cameraSelect.id}/snapshot.jpg`
            }
            alt=""
          />
          {!!workplace &&
            !!proportionWidth &&
            !!proportionHeight &&
            workplace.length > 0 &&
            workplace.map((el) => (
              <Fragment key={el.id}>
                {el.coords.map((element) => (
                  <div
                    key={generateString(14)}
                    className={styles.oldCoord}
                    style={{
                      top: `${element?.y1 / proportionHeight}px`,
                      left: `${element?.x1 / proportionWidth}px`,
                      width: `${(element?.x2 - element?.x1) / proportionHeight}px`,
                      height: `${(element?.y2 - element?.y1) / proportionWidth}px`,
                      zIndex: 1,
                      background:
                        zoneId && zoneId.includes(el.id)
                          ? 'rgb(254, 97, 0, 0.6)'
                          : 'rgba(33, 33, 33, 0.6)',
                    }}
                  >
                    {el.name}
                  </div>
                ))}
              </Fragment>
            ))}
        </div>
      ) : (
        <CameraTest cameraIP={cameraIP} userName={userName} password={password} />
      )}
    </div>
  );
};
