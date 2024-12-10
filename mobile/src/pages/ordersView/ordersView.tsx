import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonListHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToggle,
  IonDatetime,
  IonModal,
  IonLoading,
  IonPage,
} from "@ionic/react";
import { ROUTES } from "../../shared/constants/routes";
import { timeIntervals } from "../../constants/timeIntervals";
import { parseInputDate } from "../../utils/parseInputDate";
import { Header } from "../../components/header/Header";
import TimelineChart from "../../components/timelineChart/TimelineChart";
import moment from "moment";
import { getOrderViewOperations, getOrderViewOrderList } from "../../api/ordersView";
import { useCookies } from "react-cookie";
import { OperationItem } from "../../models/interfaces/operationItem.interface";
import { OrdersList } from "../../components/ordersList/OrdersList";
import { OrderItem } from "../../models/interfaces/orderItem.interface";
import "./styles.scss";
import { useTranslation } from "react-i18next";
import { Settings } from "../../assets/svg/SVGcomponent";
import { SettingsModal } from "../../components/ordersView/settingsModal/SettingsModal";
import { SearchModal } from "../../components/ordersView/searchModal/SearchModal";

export const OrdersView: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [cookies] = useCookies(["token"]);
  const [showLoading, setShowLoading] = useState(false);
  const [orderListLoading, setOrderListLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [updateFilter, setUpdateFilter] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<keyof typeof timeIntervals>("OneDay");
  const [showScheduled, setShowScheduled] = useState<boolean>(false);
  const [data, setData] = useState<OperationItem[]>([]);
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState(
    moment().set({ year: 2024, month: 10, date: 27, hour: 10, minute: 0, second: 0 }).format("YYYY-MM-DDTHH:mm:ss")
  );

  const [prevRange, setPrevRange] = useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
  const { t } = useTranslation();

  useEffect(() => {
    const currentDay = selectedRange.split("T")[0];
    const endDay = moment(selectedRange).add(7, "days").format("YYYY-MM-DD");
    const prevDay = prevRange.split("T")[0];
    if (selectedRange && currentDay !== prevDay) {
      const fetchData = async () => {
        try {
          setShowLoading(true);
          const response = await getOrderViewOperations(cookies.token, currentDay, endDay);
          const operations: OperationItem[] = response.data;

          setData(operations);

          setPrevRange(selectedRange);
        } catch (error) {
          console.log(error);
        } finally {
          setShowLoading(false);
        }
      };
      fetchData();
    }

    getOrderViewOrderList("", currentDay, endDay)
      .then(response => {
        setOrdersList(response.data);
      })
      .catch(error => console.log(error))
      .finally(() => setOrderListLoading(false));
  }, [selectedRange, selectedInterval, updateFilter]);

  const handleToggle = () => {
    setShowScheduled(prev => !prev);
  };

  const handleDateTimeChange = (e: CustomEvent<any>) => {
    const selectedDateTime = e.detail.value;
    setSelectedRange(selectedDateTime);
  };

  const selectOrder = (orId: string) => {
    if (orId === selectedOrderId) {
      setSelectedOrderId("");
    } else {
      setSelectedOrderId(orId);
      setTimeout(() => {
        const timeline = document.querySelector(".chartWrapper");
        const barElement = timeline?.querySelector(`[data-or-id='${orId}']`);
        if (barElement) {
          barElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <Header
          title={t("text.ordersView")}
          backButtonHref={ROUTES.ORDERS}
          endButton={<img src={Settings} onClick={() => setOpenSettings(true)} />}
        />
        <div className="ion-padding">
          <IonGrid>
            <IonRow className="ion-align-items-center dateTimeControls">
              <IonCol id="openDateTimePicker">
                <IonListHeader>
                  {parseInputDate(selectedRange, timeIntervals[selectedInterval].milliseconds, t("lang"))}
                </IonListHeader>
              </IonCol>
            </IonRow>
          </IonGrid>
          <div>
            <IonSegment
              value={selectedInterval}
              scrollable={false}
              onIonChange={e => {
                const value = e.detail.value;
                setSelectedInterval(value as keyof typeof timeIntervals);
              }}
            >
              {Object.entries(timeIntervals).map(([key, interval]) => (
                <IonSegmentButton key={interval.milliseconds} value={key}>
                  <IonLabel>{interval.label[t("lang")]}</IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          </div>
        </div>

        <IonLoading isOpen={showLoading} spinner="circular" />

        <TimelineChart
          startTime={selectedRange}
          selectedInterval={timeIntervals[selectedInterval]}
          showScheduled={showScheduled}
          data={data}
          selectedOrderId={selectedOrderId}
        />

        <div className="ion-padding ordersPanel">
          <IonToggle justify="space-between" checked={showScheduled} onIonChange={handleToggle}>
            {t("text.scheduled")}
          </IonToggle>
          <OrdersList
            orders={ordersList}
            setSelectedOrderId={selectOrder}
            selectedOrderId={selectedOrderId}
            loading={orderListLoading}
            setOpenSearchModal={setOpenSearchModal}
          />
        </div>

        <IonModal ref={modal} trigger="openDateTimePicker">
          <IonDatetime
            id="datetime-picker"
            presentation="date-time"
            value={selectedRange}
            onIonChange={handleDateTimeChange}
            className="dateTimePickerWrapper"
            locale={t("lang")}
          >
            <span slot="time-label">{t("text.startTime")}</span>
          </IonDatetime>
        </IonModal>

        <SettingsModal
          isOpen={openSettings}
          onClose={() => setOpenSettings(false)}
          onSave={() => setUpdateFilter(true)}
        />

        <SearchModal
          isOpen={openSearchModal}
          onClose={() => setOpenSearchModal(false)}
          onSelect={setSelectedOrderId}
          orders={ordersList}
        />
      </IonContent>
    </IonPage>
  );
};
