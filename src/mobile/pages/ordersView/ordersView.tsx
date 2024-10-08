import React, { useRef, useState } from "react";
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

export const OrdersView: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [timeMode, setTimeMode] = useState<TimeMode>(TimeMode.hour);
  const [selectedInterval, setSelectedInterval] = useState<string>("1h");
  const [hourInterval, setHourInterval] = useState<TimeInterval>("1h");
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showScheduled, setShowScheduled] = useState(false);
  const [selectedRange, setSelectedRange] = useState(
    moment()
      .set({ hour: 8, minute: 0, second: 0 })
      .format("YYYY-MM-DDTHH:mm:ss")
  );
  const data = [
    {
      category: "Category 1",
      label: "Label 1",
      start: 1727938837000,
      end: 1727938859000,
    },
    {
      category: "Category 2",
      label: "Label 1",
      start: 1727938837000,
      end: 1727938859000,
    },
    {
      category: "Category 3",
      label: "Label 1",
      start: 1727938837000,
      end: 1727938859000,
    },
    {
      category: "Category 4",
      label: "Label 1",
      start: 1727938837000,
      end: 1727938859000,
    },
    {
      category: "Category 5",
      label: "Label 1",
      start: 1727938837000,
      end: 1727938859000,
    },
    {
      category: "Category 6",
      label: "Label 1",
      start: 1727938837000,
      end: 1727938859000,
    },
    {
      category: "Category 7",
      label: "Label 1",
      start: 1727938837000,
      end: 1727938859000,
    },
  ];

  const handleToggle = () => {
    setShowScheduled(!showScheduled);
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
