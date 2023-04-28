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
  const [coords, setCoords] = useState<Coordinat[]>([]);
  const [isClose, setIsClose] = useState<any>(false);
  const [itemName, setItemName] = useState<string>('');
  const [itemCount, setItemCount] = useState<number>(0);
  const [currentSelect, setCurrentSelect] = useState('');
  useEffect(() => {
    if (!isOpen) {
      setIsClose(false);
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
      camera: camerasData
        ? camerasData.filter((el: any) => el.text === camera)[0]
        : { id: '0', text: 'asd' },
    };
    setFormData(dataForm);
  };

  const submitHandler = () => {
    const dataForm = {
      name: itemName,
      low_stock_level: itemCount,
      camera: currentSelect,
      coords: coords,
    };
    setIsClose({ loading: true });
    console.log(dataForm);
    if (coords.length > 0) {
      dispatch(
        addItem({
          token: cookies.token,
          hostname: window.location.hostname,
          body: { ...dataForm },
        })
      ).then((response: any) => {
        setIsClose({ status: response.type.includes('fulfilled'), loading: false });
        setTimeout(() => {
          handleClose();
        }, 2000);
      });
    } else {
      setIsClose({ status: false });
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div className={styles.form}>
        <div className={styles.header}>
          <h3 className={styles.title}>Item settings</h3>
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
                  setCurrentSelect={(select) => setCurrentSelect(select)}
                  camerasData={camerasData}
                />
              </div>
            ) : null}
            {/* <Button
              text="Continue"
              className={styles.button}
              type="submit"
              disabled={itemName === '' || String(itemCount).length === 0}
            /> */}
          </form>
        </div>
      </div>
      <Coordinates
        submitHandler={submitHandler}
        setCoords={(coords: any) => setCoords(coords)}
        currentSelect={currentSelect}
      />
      {isClose && (
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
        </>
      )}
    </Modal>
  );
};
