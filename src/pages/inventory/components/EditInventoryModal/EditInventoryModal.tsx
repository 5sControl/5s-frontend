/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button } from '../../../../components/button/button';
import { Modal } from '../../../../components/modal';
import { Close } from '../../../../assets/svg/SVGcomponent';
import styles from './editInventoryModal.module.scss';
import { Input } from '../../../../components/input';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { editItem, selectEditInventoryModal } from './editInventoryModalSlice';
import { useCookies } from 'react-cookie';
import { getInventoryItemsAsync, selectInventory } from '../../inventorySlice';
import { EditInventoryData } from './types';
import { Coordinat } from '../../types';
import { Coordinates } from './Coordiantes';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';
import { Preloader } from '../../../../components/preloader';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const EditInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const { currentEditItem } = useAppSelector(selectEditInventoryModal);
  const { camerasData } = useAppSelector(selectInventory);
  const [cookies] = useCookies(['token']);
  const [isShowCoord, setIsShowCoord] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditInventoryData>({});
  const [coords, setCoords] = useState<Coordinat[]>([]);
  const [isClose, setIsClose] = useState<any>(false);
  const [itemName, setItemName] = useState<string | undefined>('');
  const [itemCount, setItemCount] = useState<number | undefined>(0);
  const [isCloseClick, setIsCloseClick] = useState<any>(false);

  const submitHandler = () => {
    const dataForm = formData;
    dataForm.coords = coords;
    setIsClose({ loading: true });
    dispatch(
      editItem({
        token: cookies.token,
        hostname: window.location.hostname,
        body: { ...dataForm, camera: dataForm.camera?.id },
      })
    ).then((response: any) => {
      setIsClose({ status: response.type.includes('fulfilled'), loading: false });
      setTimeout(() => {
        handleClose();
        dispatch(
          getInventoryItemsAsync({
            token: cookies.token,
            hostname: window.location.hostname,
            isSort: false,
          })
        );
      }, 2000);
    });
  };

  useEffect(() => {
    setIsCloseClick(false);
    if (!isOpen) {
      setIsShowCoord(false);
      setIsClose(false);
    } else {
      setItemName(currentEditItem?.name);
      setItemCount(currentEditItem?.low_stock_level);
    }
  }, [isOpen]);

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
    if (currentEditItem && currentEditItem.id) {
      const dataForm = {
        name,
        low_stock_level,
        id: currentEditItem.id,
        camera: camerasData
          ? camerasData.filter((el: any) => el.text === camera)[0]
          : { id: '0', text: 'asd' },
      };
      setFormData(dataForm);
      setIsShowCoord(true);
    }
  };
  // console.log(currentEditItem, camerasData);
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className={isCloseClick ? styles.modalHide : isShowCoord ? styles.modalCoord : styles.modal}
    >
      {!isShowCoord && (
        <div>
          <div className={styles.header}>
            <h3 className={styles.title}>Edit item</h3>
            <Close onClick={() => setIsCloseClick(true)} />
          </div>
          <div className={styles.content}>
            <form onSubmit={onSubmit}>
              <div className={styles.input}>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Item name"
                  value={itemName}
                  onChange={(e: any) => setItemName(e.target.value)}
                />
              </div>
              <div className={styles.input}>
                <Input
                  id="low_stock_level"
                  name="low_stock_level"
                  type="text"
                  label="Low stock level"
                  value={String(itemCount)}
                  onChange={(e: any) => setItemCount(e.target.value.replace(/[^\d.]/g, ''))}
                />
              </div>
              {camerasData && (
                <div className={styles.input}>
                  <SelectBase
                    id="camera_type"
                    name="camera_type"
                    label="Select a camera"
                    listOfData={camerasData}
                    activeSelect={camerasData.findIndex(
                      (item: { text: string; id: string }) => item.id === currentEditItem?.camera
                    )}
                  />
                </div>
              )}
              <Button
                text="Continue"
                className={styles.button}
                type="submit"
                disabled={itemName === '' || String(itemCount).length === 0}
              />
            </form>
          </div>
        </div>
      )}
      {isShowCoord && (
        <Coordinates
          submitHandler={submitHandler}
          formData={formData}
          setCoords={(coords: any) => setCoords(coords)}
          coordinates={currentEditItem?.coords}
          setIsShowCoord={(type) => setIsShowCoord(type)}
          closed={() => setIsCloseClick(true)}
        />
      )}
      {(isClose || isCloseClick) && (
        <>
          {isClose && (
            <div className={styles.response}>
              <div>
                {isClose.loading ? (
                  <Preloader loading={true} />
                ) : isClose.status ? (
                  <>
                    <IoIosCheckmarkCircle className={styles.icons} style={{ color: 'green' }} />
                    <p>The item is saved</p>
                  </>
                ) : (
                  <>
                    <IoIosCloseCircle className={styles.icons} style={{ color: 'red' }} />
                    <p>The item is not saved</p>
                  </>
                )}
              </div>
            </div>
          )}
          {isCloseClick && (
            <div className={styles.ifClose}>
              <div className={styles.ifClose__container}>
                <div className={styles.ifClose__header}>
                  <h2>Save changes?</h2>
                  <span>You’ve made changes to the item. Click “Save” to keep them.</span>
                </div>
                <div className={styles.ifClose__footer}>
                  <button className={styles.ifClose__footer_no} onClick={handleClose}>
                    No
                  </button>
                  <button className={styles.ifClose__footer_yes} onClick={submitHandler}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};
