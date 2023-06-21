/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { Modal } from '../../../../components/modal';
import { Input } from '../../../../components/input';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { addItem } from './addInventoryModalSlice';
import { selectInventory, setCurrentItemName } from '../../inventorySlice';
import { Coordinates } from './coordinates';
import { Coordinat } from '../../types';
import { Preloader } from '../../../../components/preloader';
import { Tooltip } from '../../../../assets/svg/SVGcomponent';
import tooltipImage from '../../../../assets/png/tooltipInventory.png';
import { Notification } from '../../../../components/notification/notification';

import styles from '../InventoryModal.module.scss';
import './moveable.scss';
import { Button } from '../../../../components/button';

type PropsType = {
  isOpen: boolean;
  isHide?: boolean;
  handleClose: () => void;
  setIsNotification: () => void;
  handleOpenEditNotificationModal: () => void;
};

export const AddInventoryModal: React.FC<PropsType> = ({
  isOpen,
  isHide,
  handleClose,
  setIsNotification,
  handleOpenEditNotificationModal,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { camerasData, isSMTPServerConnect, isFullOwnCompanyInfo, emailNotificationInfo } =
    useAppSelector(selectInventory);
  const [cookies] = useCookies(['token']);
  const [coords, setCoords] = useState<Coordinat[]>([]);
  const [isClose, setIsClose] = useState<any>(false);
  const [itemName, setItemName] = useState<string>('');
  const [itemCount, setItemCount] = useState<number>(0);
  const [currentSelect, setCurrentSelect] = useState('');
  const [isMulti, setIsMulti] = useState(false);
  const [isTooltipClicked, setIsTooltipClicked] = useState(false);
  const [isScale, setIsScale] = useState<any>(false);
  const [orderAmount, setOrderAmount] = useState<number | null>(0);
  const [selectedSupplierID, setSelectedSupplierID] = useState<number | null>(null);
  const [isAutomaticallyOrder, setIsAutomaticallyOrder] = useState(false);

  useEffect(() => {
    dispatch(setCurrentItemName(itemName));
  }, [itemName]);

  useEffect(() => {
    if (!isOpen) {
      setIsClose(false);
      setItemName('');
      setItemCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    !isSMTPServerConnect && setIsAutomaticallyOrder(false);
    !isFullOwnCompanyInfo && setIsAutomaticallyOrder(false);
  }, [isSMTPServerConnect, isFullOwnCompanyInfo]);

  const submitHandler = () => {
    const dataForm = {
      name: itemName,
      low_stock_level: itemCount,
      camera: currentSelect,
      coords: coords.map((element: Coordinat) => {
        const { id, ...rest } = element; // Используйте деструктуризацию объекта и оператор rest
        return rest;
      }),
      multi_row: isMulti,
      order_quantity: null as number | null,
      suppliers: null as number | null,
      ...emailNotificationInfo,
    };
    if (isAutomaticallyOrder) {
      dataForm.order_quantity = orderAmount;
      dataForm.suppliers = selectedSupplierID;
    }
    const coordNegativeArray = coords.filter(
      (coord) => coord.x1 < 0 || coord.x2 < 0 || coord.y1 < 0 || coord.y2 < 0
    );
    setIsClose({ loading: true });
    if (coords.length > 0 && coordNegativeArray.length === 0 && itemName && itemName.length > 0) {
      dispatch(
        addItem({
          token: cookies.token,
          hostname: window.location.hostname,
          body: { ...dataForm },
        })
      )
        .then((response: any) => {
          setIsClose({ status: !!response.payload.id, loading: false });

          if (response.payload.id) {
            handleClose();
            setIsNotification();
          } else {
            setTimeout(() => {
              setIsClose(false);
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIsClose({ status: false });
      setTimeout(() => {
        setIsClose(false);
      }, 2000);
    }
  };

  const handleToggle = () => {
    setIsMulti((prevState) => !prevState);
  };

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
              <span>Single row</span>
              <div
                className={`toggle ${isMulti ? 'toggle--on' : 'toggle--off'}`}
                onClick={handleToggle}
              >
                <div className="toggle__button"></div>
              </div>
              <span>Multi row</span>
            </div>
          </div>

          <form>
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
            ) : (
              <Link to="/configuration/camera" className={styles.addCamera}>
                Add camera
              </Link>
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
      {currentSelect.length > 0 && (
        <Coordinates
          submitHandler={submitHandler}
          setCoords={(coords: any) => setCoords(coords)}
          currentSelect={currentSelect}
          handleClose={handleClose}
          itemName={itemName}
          setIsScale={(e) => setIsScale(e)}
          isScale={isScale}
        />
      )}
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
