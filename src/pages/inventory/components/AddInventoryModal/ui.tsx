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
import { getSelectedCameras } from '../../../../api/cameraRequest';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
};

export const AddInventoryModal: React.FC<PropsType> = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();
  const { connectResponseDataAdd } = useAppSelector(selectAddInventoryModal);
  const [cookies] = useCookies(['token']);
  const [listOfDataForSelect, setListOfDataForSelect] = useState([]);
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
      console.log(response);
      setListOfDataForSelect(response);
    });
  }, [connectResponseDataAdd]);
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
      low_stock_level: { value: number };
      current_stock_level: { value: number };
      camera_type: { value: string };
    };
    const name = target.name.value;
    const low_stock_level = target.low_stock_level.value;
    const current_stock_level = target.current_stock_level.value;
    const camera = target.camera_type.value;

    const dataForm = {
      name,
      low_stock_level,
      camera,
      current_stock_level,
    };

    dispatch(
      addItem({
        token: cookies.token,
        hostname: window.location.hostname,
        body: dataForm,
      })
    );
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
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
          <div className={styles.levels}>
            <div>
              <Input
                id="current_stock_level"
                name="current_stock_level"
                type="text"
                label="Current stock level"
                placeholder={'Enter number'}
              />
            </div>
            <div>
              <Input
                id="low_stock_level"
                name="low_stock_level"
                type="text"
                label="Low stock level"
                placeholder={'Enter number'}
              />
            </div>
          </div>
          <div className={styles.input}>
            <SelectBase
              id="camera_type"
              name="camera_type"
              label="Select a camera"
              listOfData={listOfDataForSelect}
            />
          </div>
          <Button text="Save" className={styles.button} type="submit" />
        </form>
      </div>
    </Modal>
  );
};
