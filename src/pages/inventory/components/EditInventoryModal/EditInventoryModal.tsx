/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../components/modal';
import styles from './editInventoryModal.module.scss';
import { Input } from '../../../../components/input';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { editItem, selectEditInventoryModal } from './editInventoryModalSlice';
import { useCookies } from 'react-cookie';
import { getInventoryItemsAsync, selectInventory } from '../../inventorySlice';
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
  const [currentSelect, setCurrentSelect] = useState('');
  const [coords, setCoords] = useState<Coordinat[]>([]);
  const [isClose, setIsClose] = useState<any>(false);
  const [itemName, setItemName] = useState<string | undefined>('');
  const [itemCount, setItemCount] = useState<number | undefined>(0);

  const submitHandler = () => {
    const dataForm = {
      name: itemName,
      low_stock_level: itemCount,
      camera: currentSelect,
      coords: coords,
      id: currentEditItem?.id,
    };
    setIsClose({ loading: true });
    dispatch(
      editItem({
        token: cookies.token,
        hostname: window.location.hostname,
        body: { ...dataForm },
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
    if (!isOpen) {
      setIsClose(false);
    } else {
      setItemName(currentEditItem?.name);
      setItemCount(currentEditItem?.low_stock_level);
    }
  }, [isOpen]);

  // console.log(currentEditItem, camerasData);
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal}>
      <div className={styles.form}>
        <div className={styles.header}>
          <h3 className={styles.title}>Edit item</h3>
        </div>
        <div className={styles.content}>
          <form>
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
                  setCurrentSelect={(select) => setCurrentSelect(select)}
                  camerasData={camerasData}
                />
              </div>
            )}
          </form>
        </div>
      </div>
      <Coordinates
        submitHandler={submitHandler}
        itemName={itemName}
        setCoords={(coords: any) => setCoords(coords)}
        coordinates={currentEditItem?.coords}
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
