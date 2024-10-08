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
  IonChip,
  IonDatetime,
  IonModal,
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
import "./styles.scss";
import { getOrderViewOperations } from "../../api/ordersView";
import { useCookies } from "react-cookie";
import { OperationItem } from "../../models/interfaces/operationItem.interface";

export const OrdersView: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [cookies] = useCookies(["token"]);
  const [timeMode, setTimeMode] = useState<TimeMode>(TimeMode.hour);
  const [selectedInterval, setSelectedInterval] = useState<string>("1h");
  const [hourInterval, setHourInterval] = useState<TimeInterval>("1h");
  const [showDatepicker, setShowDatepicker] = useState<boolean>(false);
  const [showScheduled, setShowScheduled] = useState<boolean>(false);
  const [data, setData] = useState<OperationItem[]>([]);
  const [selectedRange, setSelectedRange] = useState(
    moment()
      .set({ hour: 8, minute: 0, second: 0 })
      .format("YYYY-MM-DDTHH:mm:ss")
  );
  // const data = [
  //   {
  //     category: "Category 1",
  //     label: "Label 1",
  //     start: 1727938837000,
  //     end: 1727938859000,
  //   },
  //   {
  //     category: "Category 2",
  //     label: "Label 1",
  //     start: 1727938837000,
  //     end: 1727938859000,
  //   },
  //   {
  //     category: "Category 3",
  //     label: "Label 1",
  //     start: 1727938837000,
  //     end: 1727938859000,
  //   },
  //   {
  //     category: "Category 4",
  //     label: "Label 1",
  //     start: 1727938837000,
  //     end: 1727938859000,
  //   },
  //   {
  //     category: "Category 5",
  //     label: "Label 1",
  //     start: 1727938837000,
  //     end: 1727938859000,
  //   },
  //   {
  //     category: "Category 6",
  //     label: "Label 1",
  //     start: 1727938837000,
  //     end: 1727938859000,
  //   },
  //   {
  //     category: "Category 7",
  //     label: "Label 1",
  //     start: 1727938837000,
  //     end: 1727938859000,
  //   },
  // ];

  useEffect(() => {
    if (selectedRange) {
      const currentDay = selectedRange.split('T')[0];
      console.log(currentDay);
      const fetchData = async () => {
        try {
          const response = await getOrderViewOperations(
            cookies.token,
            currentDay,
            currentDay
          );
          console.log(response.data)
          // setData(response.data);
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
                    "eTime": 1727938832000,
                    "duration": 4800,
                    "duration_expected": 60000
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
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [selectedRange]);

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

  const openDateTimePicker = () => {
    setShowDatepicker(!showDatepicker);
  };

  return (
    <IonContent>
      <Header title="OrdersView" backButtonHref={ROUTES.MENU} />
      <div className="ion-padding">
        <IonGrid>
          <IonRow className="ion-align-items-center dateTimeControls">
            <IonCol onClick={openDateTimePicker} id="openDateTimePicker">
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

      <TimelineChart
        startTime={selectedRange}
        selectedInterval={hourInterval}
        showScheduled={showScheduled}
        data={data}
      />

      <div className="ion-padding ordersPanel">
        <IonToggle justify="space-between" checked={showScheduled} onIonChange={handleToggle}>Show scheduled time</IonToggle>
        <div className="orders-container">
          <div className="orders">
            {[...Array(20).keys()].map((index) => (
              <IonChip key={index} color="dark">
                #{45872 + index}
              </IonChip>
            ))}
          </div>
        </div>
      </div>

      <IonModal ref={modal} trigger="openDateTimePicker">
        {showDatepicker && (
          <IonDatetime
            id="datetime-picker"
            presentation="date-time"
            placeholder="Select Date and Start Time"
            onIonChange={handleDateTimeChange}
            className="dateTimePickerWrapper"
          >
            <span slot="time-label">Start time</span>
          </IonDatetime>
        )}
      </IonModal>
    </IonContent>
  );
};
