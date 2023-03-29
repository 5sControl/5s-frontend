/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../../../components/button/button';
import { Modal } from '../../../../components/modal';
import { Close } from '../../../../assets/svg/SVGcomponent';
import styles from './addInventoryModal.module.scss';
import { Input } from '../../../../components/input';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useCookies } from 'react-cookie';
import { addItem, selectAddInventoryModal } from './addInventoryModalSlice';
import { getSelectedCameras } from '../../../../api/cameraRequest';
import Moveable from 'react-moveable';
import { selectInventory } from '../../inventorySlice';
type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const { connectResponseDataAdd } = useAppSelector(selectAddInventoryModal);
  const { camerasData } = useAppSelector(selectInventory);
  const [cookies] = useCookies(['token']);
  const [listOfDataForSelect, setListOfDataForSelect] = useState([]);
  const [formData, setFormData] = useState<any>({});
  const [isShowCoord, setIsShowCoord] = useState(false);
  const image = useRef<any>();
  const coord = useRef<any>();

  const onChangeSize = (width: string, height: string, transform: string) => {
    const proportionWidth = image.current.naturalWidth / image.current.width;
    const proportionHeight = image.current.naturalHeight / image.current.height;
    const bufWidth = Number(width.replace(/px/gi, ''));
    const bufHeight = Number(height.replace(/px/gi, ''));
    const bufTrans = transform.replace(/[^\d,-]/g, '').split(',');
    const bufTransWidth = Number(bufTrans[0]);
    const bufTransHeight = Number(bufTrans[1]);
    // console.log(image.current.width, 'image width');
    // console.log(image.current.height, 'image height');
    // console.log(bufWidth, bufHeight);
    // console.log('x1, x2', bufTrans);
    console.log('x1, y1', bufTransWidth * proportionHeight, bufTransHeight * proportionHeight);
    console.log(
      'x2, y2',
      bufWidth * proportionHeight + bufTransWidth * proportionHeight,
      bufHeight * proportionHeight + bufTransHeight * proportionHeight
    );
  };

  useEffect(() => {
    if (connectResponseDataAdd) {
      handleClose();
    }
    getSelectedCameras(window.location.hostname, cookies.token).then((res: any) => {
      const response = res.data.map((item: any, index: number) => {
        return {
          id: index,
          text: item.name,
        };
      });
      setListOfDataForSelect(response);
    });
  }, [connectResponseDataAdd]);
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
      low_stock_level: { value: number };
      camera_type: { value: string };
    };
    const name = target.name.value;
    const low_stock_level = target.low_stock_level.value;
    const camera = target.camera_type.value;

    const dataForm = {
      name,
      low_stock_level,
      camera,
    };
    setFormData(dataForm);
    setIsShowCoord(true);
    console.log(isShowCoord);
    // dispatch(
    //   addItem({
    //     token: cookies.token,
    //     hostname: window.location.hostname,
    //     body: dataForm,
    //   })
    // );
  };
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className={isShowCoord ? styles.modalCoord : styles.modal}
    >
      {!isShowCoord && (
        <div>
          <div className={styles.header}>
            <h3 className={styles.title}>Add item</h3>
            <Close onClick={handleClose} />
          </div>

          <div className={styles.content}>
            <form onSubmit={onSubmit}>
              <div className={styles.input}>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Item name"
                  placeholder={'Enter item name'}
                />
              </div>
              <div className={styles.input}>
                <Input
                  id="low_stock_level"
                  name="low_stock_level"
                  type="text"
                  label="Low stock level"
                  placeholder={'Enter number'}
                />
              </div>
              <div className={styles.input}>
                <SelectBase
                  id="camera_type"
                  name="camera_type"
                  label="Select a camera"
                  listOfData={listOfDataForSelect}
                />
              </div>
              <Button text="Continue" className={styles.button} type="submit" />
            </form>
          </div>
        </div>
      )}
      {isShowCoord && (
        <div className={styles.modalCoordContainer}>
          <div className={styles.area}>
            <img
              ref={image}
              src={
                process.env.REACT_APP_ENV === 'proxy'
                  ? `${process.env.REACT_APP_NGROK}images/${formData.camera}/snapshot.jpg`
                  : process.env.REACT_APP_ENV === 'wify'
                  ? `${process.env.REACT_APP_IP_SERVER}images/${formData.camera}/snapshot.jpg`
                  : `http://${window.location.hostname}/images/${formData.camera}/snapshot.jpg`
              }
            />
            <div ref={coord} className={styles.coord}></div>
            <Moveable
              target={coord}
              container={image?.current}
              draggable={true}
              resizable={true}
              throttleDrag={0}
              throttleResize={0}
              throttleRotate={0}
              keepRatio={false}
              origin={false}
              edge={true}
              onDragEnd={({ target }) => {
                onChangeSize(target.style.width, target.style.height, target.style.transform);
              }}
              onResizeEnd={({ target }) => {
                onChangeSize(target.style.width, target.style.height, target.style.transform);
              }}
              onDrag={(e) => {
                e.target.style.transform = e.transform;
              }}
              onResize={(e) => {
                const beforeTranslate = e.drag.beforeTranslate;
                e.target.style.width = `${e.width}px`;
                e.target.style.height = `${e.height}px`;
                e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
              }}
            />
          </div>
          <div className={styles.footer}>button</div>
        </div>
      )}
    </Modal>
  );
};
