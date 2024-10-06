import {
    IonContent,
    IonListHeader,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonGrid,
    IonRow,
    IonCol,
    IonToggle,
    IonChip,
    IonDatetime,
    IonModal,
  } from "@ionic/react";
  import React, { useRef, useState } from "react";
  import { ROUTES } from "../../../shared/constants/routes";
  import { timeIntervals } from "../../constants/timeIntervals";
  import { HourMode, MinuteMode } from "../../assets/svg/SVGcomponent";
  import "../../styles/common.scss";
  import "./styles.scss";
import { parseInputDate } from "../../utils/parseInputDate";
import { TimeMode } from "../../models/enums/timeMode.enum";
import { Header } from "../../components/header/Header";
  
  export const OrdersView = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [timeMode, setTimeMode] = useState<TimeMode>(TimeMode.hour);
    const [selectedInterval, setSelectedInterval] = useState<string>("1h");
    const [showDatepicker, setShowDatepicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState("");
  
    const handleTimeModeChange = (value: TimeMode) => {
      setTimeMode(value);
      setSelectedInterval(timeIntervals[value][0].value);
    };
  
    const handleDateTimeChange = (e: any) => {
      const selectedDateTime = e.detail.value;
      console.log(selectedDateTime);
      setSelectedRange(selectedDateTime);
    };
  
    const openDateTimePicker = () => {
      setShowDatepicker(!showDatepicker);
    };

    return (
      <IonContent>
        <Header title="OrdersView" backButtonHref={ROUTES.MENU}/>
        <div className="ion-padding">
          <IonGrid>
            <IonRow class="ion-align-items-center dateTimeControls">
              <IonCol onClick={openDateTimePicker} id="openDateTimePicker">
                <IonListHeader>{parseInputDate(selectedRange, timeMode, selectedInterval)}</IonListHeader>
              </IonCol>
              <IonCol size="auto">
                <IonSegment
                  className="timeMode"
                  value={timeMode}
                  onIonChange={(e) =>
                    handleTimeModeChange(
                      e.detail.value as TimeMode
                    )
                  }
                >
                  <IonSegmentButton value={"hourMode"}>
                    <img src={HourMode} alt="hour mode" />
                  </IonSegmentButton>
                  <IonSegmentButton value={"minuteMode"}>
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
              onIonChange={(e) =>
                setSelectedInterval(e.detail.value?.toString() || "")
              }
            >
              {timeIntervals[timeMode].map((interval) => (
                <IonSegmentButton key={interval.value} value={interval.value}>
                  <IonLabel>{interval.value}</IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          </div>
        </div>
  
        <div className="ion-padding ordersPanel">
          <IonToggle justify="space-between">Show scheduled time</IonToggle>
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
            >
              <span slot="time-label">Start time</span>
            </IonDatetime>
          )}
        </IonModal>
      </IonContent>
    );
  };
  