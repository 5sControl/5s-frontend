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
} from "@ionic/react";
import { ROUTES } from "../../../shared/constants/routes";
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
import './styles.scss'
import {useTranslation} from "react-i18next";

export const OrdersView: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [cookies] = useCookies(["token"]);
  const [showLoading, setShowLoading] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<keyof typeof timeIntervals>("OneDay");
  const [showScheduled, setShowScheduled] = useState<boolean>(false);
  const [data, setData] = useState<OperationItem[]>([]);
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState(
    moment()
      .set({ year: 2024, month: 9, date: 3, hour: 10, minute: 0, second: 0 })
      .format("YYYY-MM-DDTHH:mm:ss")
  );

  const [prevRange, setPrevRange] = useState(
    moment().format("YYYY-MM-DDTHH:mm:ss")
  );
  const {t} = useTranslation();

  useEffect(() => {
    const currentDay = selectedRange.split('T')[0];
    const endDay = moment(selectedRange).add(7,'days').format("YYYY-MM-DD")
    const prevDay = prevRange.split('T')[0];
    if (selectedRange && currentDay !== prevDay) {
      const fetchData = async () => {
        try {
          setShowLoading(true);
          // const response = await getOrderViewOperations(
          //   cookies.token,
          //   currentDay,
          //   endDay
          // );
          // const operations: OperationItem[] = response.data;

          // operations.forEach((item: OperationItem) => {
          //   const newOprs = item.oprs.filter(opr => {
          //     const startTime = moment(opr.sTime);
          //     const selectedStartTime = moment(selectedRange);
          //     return startTime.isSameOrAfter(selectedStartTime) && startTime.isBefore(selectedStartTime.add(selectedInterval, 'milliseconds'));
          //   });
          //   item.oprs = newOprs;
          // });
          // setData(operations);

          setData(
         [
              {
                "filtration_operation_id": 198,
                "oprTypeID": 126,
                "oprName": "weighing",
                "oprs": [
                  {
                    "id": 198,
                    "orId": "WH/MO/00036",
                    "sTime": 1727938827000,
                    "eTime": 1727986827000,
                    "duration": 48000,
                    "duration_expected": 60000000
                  }
                ]
              },
              {
                "filtration_operation_id": 199,
                "oprTypeID": 127,
                "oprName": "grindering",
                "oprs": [
                  {
                    "id": 199,
                    "orId": "WH/MO/00036",
                    "sTime": 1727938833000,
                    "eTime": 1727938836000,
                    "duration": 3000,
                    "duration_expected": 120000
                  }
                ]
              },
              {
                "filtration_operation_id": 200,
                "oprTypeID": 128,
                "oprName": "tempering",
                "oprs": [
                  {
                    "id": 200,
                    "orId": "WH/MO/00036",
                    "sTime": 1727945001000,
                    "eTime": 1727945012000,
                    "duration": 10800,
                    "duration_expected": 180000
                  }
                ]
              },
              {
                "filtration_operation_id": 201,
                "oprTypeID": 129,
                "oprName": "brewing",
                "oprs": [
                  {
                    "id": 201,
                    "orId": "WH/MO/00036",
                    "sTime": 1727945018000,
                    "eTime": 1727945025000,
                    "duration": 7200,
                    "duration_expected": 240000
                  }
                ]
              },
              {
                "filtration_operation_id": 202,
                "oprTypeID": 131,
                "oprName": "quality control",
                "oprs": [
                  {
                    "id": 202,
                    "orId": "WH/MO/00036",
                    "sTime": 1727945026000,
                    "eTime": 1727945031000,
                    "duration": 4800,
                    "duration_expected": 60000
                  }
                ]
              }
            ]
          )

          setPrevRange(selectedRange);
        } catch (error) {
          console.log(error);
        }
        finally{
          setShowLoading(false);
        }
      };
      fetchData();
    }

    getOrderViewOrderList('', currentDay, currentDay)
    .then((response) => {
      setOrdersList(response.data)})
      .catch((error) => console.log(error));
  }, [selectedRange, selectedInterval]);

  const handleToggle = () => {
    setShowScheduled(prev => !prev);
};

  const handleDateTimeChange = (e: CustomEvent<any>) => {
    const selectedDateTime = e.detail.value;
    setSelectedRange(selectedDateTime);
  };

  const selectOrder = (orId: string) => {
    if (orId === selectedOrderId){
      setSelectedOrderId('')
    }
    else{
      setSelectedOrderId(orId);
      setTimeout(() => {
        const timeline = document.querySelector('.chartWrapper');
        const barElement = timeline?.querySelector(`[data-or-id='${orId}']`);
        if (barElement) {
          barElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  return (
    <IonContent>
      <Header title={t('text.ordersView')} backButtonHref={ROUTES.MENU} />
      <div className="ion-padding">
        <IonGrid>
          <IonRow className="ion-align-items-center dateTimeControls">
            <IonCol id="openDateTimePicker">
              <IonListHeader>
                {parseInputDate(selectedRange, timeIntervals[selectedInterval].milliseconds)}
              </IonListHeader>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div>
          <IonSegment
            value={selectedInterval}
            scrollable={false}
            onIonChange={(e) => {
              const value = e.detail.value;
              setSelectedInterval(value as keyof typeof timeIntervals);
            }}
          >
          {Object.entries(timeIntervals).map(([key, interval]) => (
            <IonSegmentButton key={interval.milliseconds} value={key}>
              <IonLabel>{interval.label}</IonLabel>
            </IonSegmentButton>
          ))}
          </IonSegment>
        </div>
      </div>

      <IonLoading
        isOpen={showLoading}
        spinner="circular"
      />

      <TimelineChart
        startTime={selectedRange}
        selectedInterval={timeIntervals[selectedInterval]}
        showScheduled={showScheduled}
        data={data}
        selectedOrderId={selectedOrderId}
      />

      <div className="ion-padding ordersPanel">
        <IonToggle justify="space-between" checked={showScheduled} onIonChange={handleToggle}>{t('text.scheduled')}</IonToggle>
        <OrdersList orders={ordersList} setSelectedOrderId={selectOrder} selectedOrderId={selectedOrderId}/>
      </div>

      <IonModal ref={modal} trigger="openDateTimePicker">
          <IonDatetime
            id="datetime-picker"
            presentation="date-time"
            value={selectedRange}
            placeholder={t('text.datePlaceholder')}
            onIonChange={handleDateTimeChange}
            className="dateTimePickerWrapper"
          >
            <span slot="time-label">{t('text.startTime')}</span>
          </IonDatetime>
      </IonModal>
    </IonContent>
  );
};
