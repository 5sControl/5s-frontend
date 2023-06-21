/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Modal } from '../../../../components/modal';

import { Input } from '../../../../components/input';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { editItem, selectEditInventoryModal } from './editInventoryModalSlice';
import { selectInventory, setCurrentItemName, setNotificationInfo } from '../../inventorySlice';
import { Coordinat } from '../../types';
import { Coordinates } from './Coordiantes';
import { Preloader } from '../../../../components/preloader';
import { Tooltip } from '../../../../assets/svg/SVGcomponent';
import tooltipImage from '../../../../assets/png/tooltipInventory.png';
import { Notification } from '../../../../components/notification/notification';

import styles from '../InventoryModal.module.scss';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/button';

type PropsType = {
  isOpen: boolean;
  isHide?: boolean;
  handleClose: () => void;
  setIsNotification: () => void;
  handleOpenEditNotificationModal: () => void;
};

export const EditInventoryModal: React.FC<PropsType> = ({
  isOpen,
  isHide,
  handleClose,
  setIsNotification,
  handleOpenEditNotificationModal,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentEditItem } = useAppSelector(selectEditInventoryModal);
  const { camerasData, isSMTPServerConnect, isFullOwnCompanyInfo, emailNotificationInfo } =
    useAppSelector(selectInventory);
  const [cookies] = useCookies(['token']);
  const [currentSelect, setCurrentSelect] = useState('');
  const [coords, setCoords] = useState<Coordinat[]>([]);
  const [isClose, setIsClose] = useState<any>(false);
  const [itemName, setItemName] = useState<string | undefined>('');
  const [itemCount, setItemCount] = useState<number | undefined>(0);
  const [isTooltipClicked, setIsTooltipClicked] = useState(false);
  const [isScale, setIsScale] = useState<any>(false);
  const [orderAmount, setOrderAmount] = useState<number | null>(0);
  const [selectedSupplierID, setSelectedSupplierID] = useState<number | null>(null);
  const [isAutomaticallyOrder, setIsAutomaticallyOrder] = useState(false);

  const submitHandler = () => {
    const dataForm = {
      name: itemName,
      low_stock_level: itemCount,
      camera: currentSelect,
      coords: coords.map((element: Coordinat) => {
        const { id, ...rest } = element; // Используйте деструктуризацию объекта и оператор rest
        return rest;
      }),
      id: currentEditItem?.id,
      order_quantity: orderAmount as number | null,
      suppliers: selectedSupplierID as number | null,
      ...emailNotificationInfo,
    };

    if (!isAutomaticallyOrder) {
      dataForm.order_quantity = null;
      dataForm.suppliers = null;
    }

    const coordNegativeArray = coords.filter(
      (coord) => coord.x1 < 0 || coord.x2 < 0 || coord.y1 < 0 || coord.y2 < 0
    );
    setIsClose({ loading: true });

    if (coords.length > 0 && coordNegativeArray.length === 0 && itemName && itemName.length > 0) {
      dispatch(
        editItem({
          token: cookies.token,
          hostname: window.location.hostname,
          body: { ...dataForm },
        })
      )
        .then((response: any) => {
          setIsClose({ status: !!response.payload?.id, loading: false });
          if (response.payload && response.payload.id) {
            handleClose();
            setIsNotification();
          } else {
            setTimeout(() => {
              setIsClose(false);
            }, 2000);
          }
        })
        .catch(() => {
          setIsClose({ status: false });
          setTimeout(() => {
            setIsClose(false);
          }, 2000);
        });
    } else {
      setIsClose({ status: false });
      setTimeout(() => {
        setIsClose(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsClose(false);
      setCurrentSelect('');
    } else {
      setItemName(currentEditItem?.name);
      setItemCount(currentEditItem?.low_stock_level);
      setOrderAmount(currentEditItem ? currentEditItem.order_quantity : null);
      setSelectedSupplierID(currentEditItem ? currentEditItem.suppliers : null);
      setIsAutomaticallyOrder(!!currentEditItem?.suppliers);
    }
  }, [isOpen]);

  useEffect(() => {
    dispatch(
      setNotificationInfo({
        to_emails: currentEditItem?.to_emails || null,
        copy_emails: currentEditItem?.copy_emails || null,
        subject: currentEditItem?.subject || null,
      })
    );
  }, []);

  useEffect(() => {
    !isSMTPServerConnect && setIsAutomaticallyOrder(false);
    !isFullOwnCompanyInfo && setIsAutomaticallyOrder(false);
  }, [isFullOwnCompanyInfo, isSMTPServerConnect, currentEditItem, isOpen]);

  useEffect(() => {
    dispatch(setCurrentItemName(itemName || ''));
  }, [itemName]);

  console.log(
    currentEditItem &&
      camerasData &&
      camerasData.findIndex(
        (item: { text: string; id: string }) => item.id === currentEditItem?.camera
      ) > -1
      ? camerasData.findIndex(
          (item: { text: string; id: string }) => item.id === currentEditItem?.camera
        )
      : 0
  );
  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className={`${styles.modal} ${isHide && styles.hide_modal}`}
      disableClickBg={true}
      noESC={isScale}
    >
      <div className={styles.form}>
        <div className={styles.header}>
          <h3 className={styles.title}>Item settings</h3>
        </div>

        <div className={styles.content}>
          <div className={styles.algorithm}>
            <h2>
              Algorithm <Tooltip onClick={() => setIsTooltipClicked(true)} />
              {isTooltipClicked && (
                <>
                  <div
                    className={styles.algorithm__container}
                    onClick={() => setIsTooltipClicked(false)}
                  ></div>
                  <img src={tooltipImage} className={styles.algorithm__image} alt={'tooltip'} />
                </>
              )}
            </h2>
            <div className={styles.algorithm__toggle}>
              {currentEditItem?.multi_row ? <span>Multi row</span> : <span>Single row</span>}
            </div>
          </div>
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
            {camerasData && currentEditItem && (
              <div className={styles.input}>
                <SelectBase
                  id="camera_type"
                  name="camera_type"
                  label="Select a camera"
                  listOfData={camerasData}
                  activeSelect={
                    camerasData.findIndex(
                      (item: { text: string; id: string }) => item.id === currentEditItem?.camera
                    ) > -1
                      ? camerasData.findIndex(
                          (item: { text: string; id: string }) =>
                            item.id === currentEditItem?.camera
                        )
                      : 0
                  }
                  setCurrentSelect={(select) => setCurrentSelect(select)}
                  camerasData={camerasData}
                />
              </div>
            )}
          </form>
        </div>

        <div className={styles.content}>
          <div className={styles.algorithm}>
            <div className={styles.email_settings}>
              <div className={styles.send_to_box}>
                <h6>Notification about low stock level</h6>
                <span className={styles.email_settings_list}>Send to:</span>
                <span className={styles.email_settings_list}>
                  {` ${emailNotificationInfo.to_emails?.join(', ') || '-'}`}
                </span>
              </div>

              <Button
                text="Edit"
                type="button"
                variant={'text'}
                onClick={handleOpenEditNotificationModal}
                disabled={!isSMTPServerConnect}
              />
            </div>

            {!isSMTPServerConnect && (
              <div className={styles.no_info_for_suppliers}>
                <span
                  className={styles.no_info_link}
                  onClick={() => navigate('/configuration/notifications')}
                >
                  Set up{' '}
                </span>
                <span>SMTP server.</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Coordinates
        submitHandler={submitHandler}
        itemName={itemName}
        setCoords={(coords: any) => setCoords(coords)}
        coordinates={currentEditItem?.coords}
        currentSelect={currentSelect}
        handleClose={handleClose}
        setIsScale={(e) => setIsScale(e)}
        isScale={isScale}
      />
      {isClose && (
        <>
          {isClose.loading ? (
            <div className={styles.response}>
              <section>
                <Preloader />
              </section>
            </div>
          ) : (
            !isClose.status && <Notification status={false} message={'Could not safe the item'} />
          )}
        </>
      )}
    </Modal>
  );
};
