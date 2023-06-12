/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { Modal } from '../../../../components/modal';
import { Input } from '../../../../components/input';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { addItem } from './addInventoryModalSlice';
import { selectInventory } from '../../inventorySlice';
import { Coordinates } from './coordinates';
import { Coordinat } from '../../types';
import { Preloader } from '../../../../components/preloader';
import { Tooltip } from '../../../../assets/svg/SVGcomponent';
import tooltipImage from '../../../../assets/png/tooltipInventory.png';
import { Notification } from '../../../../components/notification/notification';

import styles from '../InventoryModal.module.scss';
import './moveable.scss';
import { ContactInfoType } from '../../../company/types';
import { getSuppliers } from '../../../../api/companyRequest';
import { SelectCustom } from '../../../../components/selectCustom';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  setIsNotification: () => void;
};

export const AddInventoryModal: React.FC<PropsType> = ({
  isOpen,
  handleClose,
  setIsNotification,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { camerasData, isSMTPServerConnect, isFullOwnCompanyInfo } =
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
  const [isTooltipSupplies, setIsTooltipSupplies] = useState(false);
  const [orderAmount, setOrderAmount] = useState<number | null>(0);
  const [selectedSupplierID, setSelectedSupplierID] = useState<number | null>(null);
  const [suppliersData, setSuppliersData] = useState<Array<{ id: number | string; text: string }>>(
    []
  );
  const [isAutomaticallyOrder, setIsAutomaticallyOrder] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClose(false);
      setItemName('');
      setItemCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    getSuppliers(window.location.hostname, cookies.token)
      .then((response) => {
        const dataForSelect = response.data.map((item: ContactInfoType) => {
          return { id: item.id, text: item.name_company };
        });
        setSuppliersData(dataForSelect);
      })
      .catch((err) => {
        console.log('setCompanyInfoError', err);
      });
  }, []);

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

  const handleAutoOrderToggle = () => {
    setIsAutomaticallyOrder((prevState) => !prevState);
  };

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      className={styles.modal}
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
            <h2>
              Supplies <Tooltip onClick={() => setIsTooltipSupplies(true)} />
              {isTooltipSupplies && (
                <>
                  <div
                    className={styles.algorithm__container}
                    onClick={() => setIsTooltipSupplies(false)}
                  ></div>
                  <div className={styles.supplies_tooltip}>
                    <h6>Supplies</h6>
                    <p>
                      Upon reaching low stock level the email will be send to the supplier ordering
                      the item. Company info will be used for order details.
                    </p>
                  </div>
                </>
              )}
            </h2>

            {isSMTPServerConnect && isFullOwnCompanyInfo && (
              <div className={styles.algorithm__toggle}>
                <span>Automatically order</span>
                <div
                  className={`toggle ${isAutomaticallyOrder ? 'toggle--on' : 'toggle--off'}`}
                  onClick={handleAutoOrderToggle}
                >
                  <div className="toggle__button"></div>
                </div>
              </div>
            )}

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

            {!isFullOwnCompanyInfo && (
              <div className={styles.no_info_for_suppliers}>
                <span className={styles.no_info_link} onClick={() => navigate('/company')}>
                  Fill in{' '}
                </span>
                <span>info about your company (Address, Phone and Email are required).</span>
              </div>
            )}
          </div>

          {isAutomaticallyOrder && (
            <form className={styles.supplies_form}>
              <div className={styles.input}>
                <SelectCustom
                  id="supplier"
                  name="supplier"
                  label="Select a supplier"
                  listOfData={suppliersData}
                  setDefaultSelect={(select) => setSelectedSupplierID(select)}
                  disabled={!suppliersData.length}
                />
                {!suppliersData.length && (
                  <div className={styles.input_add_suppliers}>
                    <span
                      onClick={() => navigate('/company/contacts/newContact')}
                      className={styles.add_suppliers_link}
                    >
                      Add{' '}
                    </span>
                    <span>suppliers to select</span>
                  </div>
                )}
              </div>

              <div className={styles.input}>
                <Input
                  id="orderAmount"
                  name="orderAmount"
                  type="number"
                  min={0}
                  label="Amount to order"
                  value={orderAmount?.toString() || '0'}
                  onChange={(e) => setOrderAmount(e.target.value)}
                />
              </div>
            </form>
          )}
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
