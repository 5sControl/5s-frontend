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
import { HourMode, MinuteMode } from "../../assets/svg/SVGcomponent";
import { parseInputDate } from "../../utils/parseInputDate";
import { TimeMode } from "../../models/enums/timeMode.enum";
import { Header } from "../../components/header/Header";
import TimelineChart from "../../components/timelineChart/TimelineChart";
import moment from "moment";
import { TimeInterval } from "../../models/types/timeInterval";
import { getOrderViewOperations, getOrderViewOrderList } from "../../api/ordersView";
import { useCookies } from "react-cookie";
import { OperationItem } from "../../models/interfaces/operationItem.interface";
import { OrdersList } from "../../components/ordersList/OrdersList";
import { OrderItem } from "../../models/interfaces/orderItem.interface";
import { MinuteScaling } from "../../models/types/minuteScaling";
import './styles.scss'
import {useTranslation} from "react-i18next";

export const OrdersView: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [cookies] = useCookies(["token"]);
  const [showLoading, setShowLoading] = useState(false);
  const [timeMode, setTimeMode] = useState<TimeMode>(TimeMode.minute);
  const [selectedInterval, setSelectedInterval] = useState<string>("6min");
  const [hourInterval, setHourInterval] = useState<TimeInterval>("4h");
  const [minuteScaling, setMinuteScaling] = useState<MinuteScaling>("6min");
  const [showScheduled, setShowScheduled] = useState<boolean>(false);
  const [data, setData] = useState<OperationItem[]>([]);
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [selectedRange, setSelectedRange] = useState(
    moment()
      .set({ year: 2024, month: 9, date: 8, hour: 14, minute: 55, second: 0 })
      .format("YYYY-MM-DDTHH:mm:ss")
  );

  const [prevRange, setPrevRange] = useState(
    moment().format("YYYY-MM-DDTHH:mm:ss")
  );
  const {t} = useTranslation();

  const getMillisecondsForInterval = (interval: string): number => {
    const hours = parseInt(interval.slice(0, -1));
    return hours * 3600 * 1000;
  };

  useEffect(() => {
    const currentDay = selectedRange.split('T')[0];
    const prevDay = prevRange.split('T')[0];
    if (selectedRange && currentDay !== prevDay) {
      const fetchData = async () => {
        try {
          setShowLoading(true);
          const response = await getOrderViewOperations(
            cookies.token,
            currentDay,
            currentDay
          );
          const operations: OperationItem[] = response.data;
            
          operations.forEach((item: OperationItem) => {
            const newOprs = item.oprs.filter(opr => {
              const startTime = moment(opr.sTime);
              const selectedStartTime = moment(selectedRange);
              return startTime.isSameOrAfter(selectedStartTime) && startTime.isBefore(selectedStartTime.add(getMillisecondsForInterval(selectedInterval), 'milliseconds'));
            });
            item.oprs = newOprs;
          });
          setData(operations);
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

  const handleTimeModeChange = (value: TimeMode) => {
    setTimeMode(value);
    setSelectedInterval(timeIntervals[value][0].value);
  };

  const handleDateTimeChange = (e: CustomEvent<any>) => {
    const selectedDateTime = e.detail.value;
    setSelectedRange(selectedDateTime);
  };

  return (
    <IonContent>
      <Header title={t('text.ordersView')} backButtonHref={ROUTES.MENU} />
      <div className="ion-padding">
        <IonGrid>
          <IonRow className="ion-align-items-center dateTimeControls">
            <IonCol id="openDateTimePicker">
              <IonListHeader>
                {parseInputDate(selectedRange, timeMode, selectedInterval)}
              </IonListHeader>
            </IonCol>
            <IonCol size="auto">
              <IonSegment
                className="timeMode"
                value={timeMode}
                onIonChange={(e) =>
                  handleTimeModeChange(e.detail.value as TimeMode)
                }
              >
                <IonSegmentButton value="hourMode">
                  <img src={HourMode} alt="hour mode" />
                </IonSegmentButton>
                <IonSegmentButton value="minuteMode">
                  <img src={MinuteMode} alt="minute mode" />
                </IonSegmentButton>
              </IonSegment>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div>
          <IonSegment
            value={selectedInterval}
            scrollable={false}
            onIonChange={(e) => {
              const value = e.detail.value;
              setSelectedInterval(value?.toString() || "");
              if (timeMode === TimeMode.hour) {
                setHourInterval(value as TimeInterval);
              }
              if (timeMode === TimeMode.minute) {
                setMinuteScaling(value as MinuteScaling)
              }
            }}
          >
            {timeIntervals[timeMode].map((interval) => (
              <IonSegmentButton key={interval.value} value={interval.value}>
                <IonLabel>{interval.value}</IonLabel>
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
        selectedInterval={hourInterval}
        minuteScaling={minuteScaling}
        showScheduled={showScheduled}
        timeMode={timeMode}
        data={data}
      />

      <div className="ion-padding ordersPanel">
        <IonToggle justify="space-between" checked={showScheduled} onIonChange={handleToggle}>Show scheduled time</IonToggle>
        <OrdersList orders={ordersList}/>

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
