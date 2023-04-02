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
import { selectInventory } from '../../inventorySlice';
import { EditInventoryData } from './types';
import { Coordinates } from './Coordiantes';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const EditInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const { currentEditItem, connectResponse } = useAppSelector(selectEditInventoryModal);
  const { camerasData } = useAppSelector(selectInventory);
  const [cookies] = useCookies(['token']);
  const [isShowCoord, setIsShowCoord] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditInventoryData>({});
  const [coords, setCoords] = useState<any>({});

  const submitHandler = () => {
    const dataForm = formData;
    dataForm.coords = [coords];
    console.log(dataForm);
    dispatch(
      editItem({
        token: cookies.token,
        hostname: window.location.hostname,
        body: dataForm,
      })
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setIsShowCoord(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (connectResponse) {
      handleClose();
    }
  }, [connectResponse]);

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
        camera,
        id: currentEditItem.id,
      };
      setFormData(dataForm);
      setIsShowCoord(true);
    }
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
            <h3 className={styles.title}>Edit item</h3>
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
                  defaultValue={currentEditItem?.name}
                />
              </div>
              <div className={styles.input}>
                <Input
                  id="low_stock_level"
                  name="low_stock_level"
                  type="text"
                  label="Low stock level"
                  defaultValue={currentEditItem?.low_stock_level.toString()}
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
                      (item: { text: string; id: string }) => item.text === currentEditItem?.camera
                    )}
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
          coordinates={currentEditItem?.coords}
          setIsShowCoord={(type) => setIsShowCoord(type)}
        />
      )}
    </Modal>
  );
};
