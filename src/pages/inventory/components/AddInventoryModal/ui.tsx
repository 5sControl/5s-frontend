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
import { addItem, selectAddInventoryModal } from './addInventoryModalSlice';
import { selectInventory } from '../../inventorySlice';
import { AddInventoryData } from './types';
import { Coordinates } from './coordinates';
type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const { connectResponseDataAdd } = useAppSelector(selectAddInventoryModal);
  const { camerasData } = useAppSelector(selectInventory);
  const [cookies] = useCookies(['token']);
  const [formData, setFormData] = useState<AddInventoryData>({});
  const [isShowCoord, setIsShowCoord] = useState<boolean>(false);
  const [coords, setCoords] = useState<any>([]);

  useEffect(() => {
    if (!isOpen) {
      setIsShowCoord(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (connectResponseDataAdd) {
      handleClose();
    }
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
  };

  const submitHandler = () => {
    const dataForm = formData;
    dataForm.coords = coords;
    console.log(dataForm);
    dispatch(
      addItem({
        token: cookies.token,
        hostname: window.location.hostname,
        body: dataForm,
      })
    );
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
              {camerasData && (
                <div className={styles.input}>
                  <SelectBase
                    id="camera_type"
                    name="camera_type"
                    label="Select a camera"
                    listOfData={camerasData}
                  />
                </div>
              )}
              <Button text="Continue" className={styles.button} type="submit" />
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
          coords={coords}
        />
      )}
    </Modal>
  );
};
