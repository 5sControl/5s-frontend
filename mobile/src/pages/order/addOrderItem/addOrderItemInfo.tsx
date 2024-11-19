import React, { useState } from "react";
import { IonContent, IonList, IonPage, IonToast } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useHistory } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { Preloader } from "../../../components/preloader/preloader";
import { IOrderOperation } from "../../../models/interfaces/operationItem.interface";
import { TableRow } from "../../../models/interfaces/table.interface";
import Chip from "../../../components/chip/chip";
import { Table } from "../../../components/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Input } from "../../../components/inputs/input/Input";
import BottomButton from "../../../components/bottomButton/BottomButton";
import ModalSave from "../../../components/modalSave/modalSave";
import { setMaxOrderItemId, setOrderItems, setOrderName, setOrderItems as setStoreOrderItems, setTempOrderItemId } from "../../../store/orderSlice";
import AddButton from "../../../components/addButton/AddButton";
import { ORDER_ITEM_REQUEST, ORDER_REQUEST } from "../../../dispatcher";
import { IOrderItemAddBody } from "../../../models/interfaces/item.interface";

const RADIX = 10;

const AddOrderItemInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const storedItems: any = useSelector((state: RootState) => state.order.orderItems);
  const tempItemId: any = useSelector((state: RootState) => state.order.tempOrderItemId);
  const orderName: any = useSelector((state: RootState) => state.order.orderName);
  const item: any = storedItems[tempItemId];
  console.log('storedItems', storedItems);
  console.log('item', item);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(item?.suffix || '');
  const history = useHistory();
  
  const tableItems: TableRow[] =
    item?.operations?.map((op: IOrderOperation, index) => {
      return {
        id: op.id,
        navigationAllowed: false,
        navigateTo: '',
        values: [op.name, <Chip name={op.status}></Chip>],
      };
    }) || [];

    const saveChanges = () => {
        setIsModalOpen(false);
        console.log('storedItems 1', storedItems);
        const updatedItems = {...storedItems,  [tempItemId]: {...item, suffix: inputValue }};
        console.log('storedItems 2', updatedItems);
        dispatch(setStoreOrderItems(updatedItems));
    }

    const navigateTo = (path: string, state: any) => {
        saveChanges();
        history.push(path, state);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        saveChanges();
        history.push(ROUTES.ORDER_ADD_OPERATION);
    };

    const handleSubmit = async () => {
      setIsModalOpen(false);
      setToastMessage("Failed to save");
      // setLoading(true);
      // ORDER_REQUEST.addOrder({name: orderName, additionalInfo: '', estimatedTime: 0, estimatedTimeUnit: 'minutes'}, setLoading, setToastMessage, () => {})
      // .then((res: any) => {
      //   Object.values(storedItems).forEach((item: any) => {
      //     const newItem: IOrderItemAddBody = {
      //       orderId: res.id,
      //       name: item.name,
      //       additionalInfo: item.suffix,
      //       quantity: 1,
      //       itemId: item.id
      //     }
      //     ORDER_ITEM_REQUEST.createOrderItem(newItem, setLoading, setToastMessage, () => {
      //         const newOperation = {
      //           orderItemId: item.id,
      //           operationIds: item.operations.map(operation => operation.id)
      //         };
  
      //         ORDER_REQUEST.addOrderItemOperation(newOperation, setLoading, setToastMessage);
      //       })
      //   })
      // })
      // .finally(() => {
      //   navigateTo(ROUTES.ORDER_ADD_ITEM_INFO, { direction: "forward" });
      //   setLoading(false);
      // })
    };

    return (
    <IonPage>
      {item &&
        <>
          <Header title={item.name} onBackClick={() => navigateTo(ROUTES.ORDER_ADD_ITEM, { direction: "back" })} backButtonHref="#"/>
          <IonContent>
            {isLoading ? (
              <div className="preloader">
                <Preloader />
              </div>
            ) : (
              <>
                  <IonList>
                    <InputReadonly label={t('orders.orderItem')} value={item.name} />
                    <Input label={t('orders.suffix')} value={inputValue} handleChange={(e) => setInputValue(e.detail.value!)} required={false}/>
                    <Table
                      label={t("orders.operations")}
                      cols={[
                        { label: t("orders.name"), size: 8 },
                        { label: t("orders.status"), size: 4 },
                      ]}
                      rows={tableItems}
                    />
                    <AddButton handleClick={handleAddClick} label={t('operations.add')}></AddButton>
                    <IonToast
                      isOpen={!!toastMessage}
                      message={toastMessage || undefined}
                      duration={TOAST_DELAY}
                      onDidDismiss={() => setToastMessage(null)}
                    />
                    </IonList>
              </>
            )}
            <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSubmit} />
              <BottomButton
                handleClick={openModal}
                label={t("operations.save")}
              />
          </IonContent>
        </>
        }
    </IonPage>
  );
};

export default AddOrderItemInfo;
