/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCookies } from 'react-cookie';
import { generateString } from '../../../../functions/randomizer';
import { getInventoryItemsToCamera } from '../../inventoryAPI';
import styles from './glazik.module.scss';
import { useState, useRef, Fragment, useEffect } from 'react';
import { Modal } from '../../../../components/modal';
import { CrossWhite } from '../../../../assets/svg/SVGcomponent';

type PropsType = {
  showGlazik: any;
  cameraName: string;
  setShowGlazik: () => void;
};

export const Glazik: React.FC<PropsType> = ({ showGlazik, setShowGlazik, cameraName }) => {
  const [proportionWidth, setProportionWidth] = useState(0);
  const [proportionHeight, setProportionHeight] = useState(0);
  const [cameraBox, setCameraBox] = useState([]);

  const image = useRef<any>();

  const [cookie] = useCookies(['token']);
  const handleImageLoad = () => {
    setProportionWidth(image.current.naturalWidth / image.current.width);
    setProportionHeight(image.current.naturalHeight / image.current.height);
  };

  useEffect(() => {
    if (showGlazik) {
      getInventoryItemsToCamera(window.location.hostname, cookie.token, showGlazik.camera)
        .then((res: any) => {
          setCameraBox(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [showGlazik]);

  console.log(cameraBox);
  return (
    <Modal isOpen={true} handleClose={setShowGlazik} className={styles.glazikModal}>
      <div className={styles.image_container}>
        <div className={styles.close} onClick={setShowGlazik}>
          <CrossWhite />
        </div>
        <span className={styles.camera}>{cameraName}</span>
        <img
          ref={image}
          className={styles.img}
          onLoad={handleImageLoad}
          src={
            process.env.REACT_APP_ENV === 'proxy'
              ? `${process.env.REACT_APP_NGROK}images/${showGlazik.camera}/snapshot.jpg`
              : process.env.REACT_APP_ENV === 'wify'
              ? `${process.env.REACT_APP_IP_SERVER}images/${showGlazik.camera}/snapshot.jpg`
              : `http://${window.location.hostname}/images/${showGlazik.camera}/snapshot.jpg`
          }
          alt=""
        />
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
      </div>
    </Modal>
  );
};
