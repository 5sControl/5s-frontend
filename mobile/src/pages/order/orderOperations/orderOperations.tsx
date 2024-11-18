import React, { useEffect, useState } from "react";
import { IonContent, IonLabel, IonList, IonPage, IonLoading, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import style from "./orderOperations.module.scss";
import { useHistory, useParams } from "react-router-dom";
import { IOrderOperation, IProductOperation, Timespan } from "../../../models/interfaces/operationItem.interface";
import { formatDate } from "../../../utils/parseInputDate";
import { OPERATION_REQUEST, ORDER_REQUEST, TIMESPAN_REQUEST } from "../../../dispatcher";
import { formatTime } from "../../../utils/parseInputDate";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import { IReference } from "../../../models/interfaces/orders.interface";
import { InputLookup } from "../../../components/inputs/inputLookup/inputLookup";
import { Table } from "../../../components/table/Table";
import { ROLE } from "../../../models/enums/roles.enum";
import AddButton from "../../../components/addButton/AddButton";
import { TableRow } from "../../../models/interfaces/table.interface";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { Preloader } from "../../../components/preloader/preloader";
import Chip from "../../../components/chip/chip";

const RADIX = 10;

const OrderOperations = () => {
  const { t } = useTranslation();
  const { orderId, itemId, operationId } = useParams() as {
    orderId: string;
    itemId: string;
    operationId: string;
  };
  const [operation, setOperation] = useState<IOrderOperation>({} as IOrderOperation);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isLoaded = Boolean(Object.values(operation)?.length);
  const [operationReferences, setOperationReferences] = useState<IReference[]>([]);
  const [newOperations, setNewOperations] = useState<IProductOperation[]>([]);
  const history = useHistory();

  const onDeleteHandle = () => {
    console.log("Delete");
  };

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const getUserRole = () => {
    return localStorage.getItem("userRole");
  };

  useIonViewWillEnter(() => {
    ORDER_REQUEST.getOrderOperationById(parseInt(operationId, RADIX), setOperation, setLoading, setToastMessage);
  });

  // window.addEventListener("beforeunload", event => {
  //   if (true) {
  //     event.preventDefault();
  //   }
  // });

  // useEffect(() => {
  //   const unblock = history.block(location => {
  //     if (true) {
  //       return false; // Блокируем навигацию
  //     }
  //   });

  //   return () => {
  //     unblock();
  //   };
  // }, [history]);

  const timespanItems: TableRow[] =
    operation?.timespans
      ?.sort((a, b) => {
        if (a.duration === null && b.duration !== null) return -1;
        if (a.duration !== null && b.duration === null) return 1;
        return 0;
      })
      .map(timespan => {
        const { hours, minutes } = formatTime(timespan.duration);
        let timestring;
        if (timespan.duration === null) {
          timestring = <Chip name="in_progress" />;
        } else {
          timestring = [hours && `${hours} ${t("time.hour")}`, minutes && `${minutes} ${t("time.min")}`]
            .filter(Boolean)
            .join(" ");
        }

        return {
          id: timespan.id,
          navigateTo: ROUTES.ORDER_TIMESPAN_EDIT(
            String(orderId),
            String(itemId),
            String(operationId),
            String(timespan.id)
          ),
          navigationAllowed: getUserRole() === ROLE.WORKER,
          values: [formatDate(timespan.startedAt), timespan.employeeName, timestring || 0],
        };
      }) || [];

  return (
    <IonPage>
      <>
        <Header title={operation.name} backButtonHref={ROUTES.ORDER_ITEM(String(orderId), String(itemId))} />
        <IonContent>
          {isLoading ? (
            <div className="preloader">
              <Preloader />
            </div>
          ) : (
            <>
              {isLoaded && (
                <>
                  <IonList className={style.page}>
                    <InputReadonly label={t("orders.operation")} value={operation.name} />
                    <IonList className={style.list}>
                      {timespanItems?.length ? (
                        <Table
                          label={t("orders.implementation")}
                          cols={[
                            { label: t("form.date"), size: 4 },
                            { label: t("orders.worker"), size: 4 },
                            { label: t("form.duration"), size: 4 },
                          ]}
                          rows={timespanItems}
                        />
                      ) : (
                        <IonLabel slot="center" className="ion-padding">
                          {t("text.norecords")}
                        </IonLabel>
                      )}
                      <AddButton
                        handleClick={() =>
                          handleFabClick(ROUTES.ORDER_TIMESPAN(String(orderId), String(itemId), String(operationId)))
                        }
                        label={t("operations.add")}
                      ></AddButton>
                    </IonList>
                    <IonToast
                      isOpen={!!toastMessage}
                      message={toastMessage || undefined}
                      duration={TOAST_DELAY}
                      onDidDismiss={() => setToastMessage(null)}
                    />
                  </IonList>
                </>
              )}
            </>
          )}
        </IonContent>
      </>
    </IonPage>
  );
};

export default OrderOperations;
