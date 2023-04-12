/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Button } from '../../../../components/button/button';
import { Modal } from '../../../../components/modal';
import { Close } from '../../../../assets/svg/SVGcomponent';
import styles from './addInventoryModal.module.scss';
import { Input } from '../../../../components/input';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useCookies } from 'react-cookie';
import { addItem } from './addInventoryModalSlice';
import { selectInventory } from '../../inventorySlice';
import { AddInventoryData } from './types';
import { Coordinates } from './coordinates';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';
import './moveable.scss';
import { Coordinat } from '../../types';
import { Preloader } from '../../../../components/preloader';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const { camerasData } = useAppSelector(selectInventory);
  const [cookies] = useCookies(['token']);
  const [formData, setFormData] = useState<AddInventoryData>({});
  const [isShowCoord, setIsShowCoord] = useState<boolean>(false);
  const [coords, setCoords] = useState<Coordinat[]>([]);
  const [isClose, setIsClose] = useState<any>(false);
  const [isCloseClick, setIsCloseClick] = useState<any>(false);
  const [itemName, setItemName] = useState<string>('');
  const [itemCount, setItemCount] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setIsShowCoord(false);
      setIsClose(false);
      setIsCloseClick(false);
      setItemName('');
      setItemCount(0);
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

    const dataForm = {
      name,
      low_stock_level,
      camera,
    };
    setFormData(dataForm);
    setIsShowCoord(true);
  };

  const submitHandler = () => {
    const dataForm = formData;
    dataForm.coords = coords;
    setIsClose({ loading: true });
    dispatch(
      addItem({
        token: cookies.token,
        hostname: window.location.hostname,
        body: dataForm,
      })
    ).then((response: any) => {
      setIsClose({ status: response.type.includes('fulfilled'), loading: false });
      setTimeout(() => {
        handleClose();
      }, 2000);
    });
  };
  const closed = () => {
    setIsCloseClick(true);
    // handleClose();
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
            <Close onClick={closed} />
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
                  placeholder={'Enter number'}
                  value={String(itemCount)}
                  onChange={(e: any) => setItemCount(e.target.value.replace(/[^\d.]/g, ''))}
                />
              </div>
              {camerasData && camerasData.length ? (
                <div className={styles.input}>
                  <SelectBase
                    id="camera_type"
                    name="camera_type"
                    label="Select a camera"
                    listOfData={camerasData}
                  />
                </div>
              ) : null}
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
          setIsShowCoord={(type: boolean) => setIsShowCoord(type)}
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
                  <button
                    className={styles.ifClose__footer_yes}
                    onClick={() => setIsCloseClick(false)}
                  >
                    Yes
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
