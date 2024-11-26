import { IonContent, IonDatetime, IonLabel, IonList, IonModal, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../shared/constants/routes";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useHistory } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setEndReportDate, setReportDate, setStartReportDate } from "../../store/reportDateSlice";
import InputDate from "../../components/inputs/inputDate/inputDate";
import { formatDate, formatDateYMD, getCurrentDateTimeISO, getDateWeekAgoISO } from "../../utils/parseInputDate";

const Reports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [startDate, setStartDate] = useState(getDateWeekAgoISO());
  const [endDate, setEndDate] = useState(getCurrentDateTimeISO());
  const [isStartModalOpen, setStartModalOpen] = useState<boolean>();
  const [isEndModalOpen, setEndModalOpen] = useState<boolean>();
  const startDateModalRef = useRef<HTMLIonModalElement>(null);
  const endDateModalRef = useRef<HTMLIonModalElement>(null);

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  const handleStartDateClick = () => {
    startDateModalRef.current?.present();
    setStartModalOpen(true);
  };

  const handleEndDateClick = () => {
    endDateModalRef.current?.present();
    setEndModalOpen(true);
  };

  const handleChangeStartDate = e => {
    const date = e.detail.value!.toString();
    setStartDate(date);
    const currentDate = JSON.parse(localStorage.getItem("reportDate")!);
    currentDate.startDate = date;
    localStorage.setItem("reportDate", JSON.stringify(currentDate));
    dispatch(setStartReportDate(formatDateYMD(date)));
  };

  const handleChangeEndDate = e => {
    const date = e.detail.value!.toString();
    setEndDate(date);
    const currentDate = JSON.parse(localStorage.getItem("reportDate")!);
    currentDate.endDate = date;
    localStorage.setItem("reportDate", JSON.stringify(currentDate));
    dispatch(setEndReportDate(formatDateYMD(date)));
  };

  useIonViewWillEnter(() => {
    const date = {
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(setReportDate(date));

    const reportDate = localStorage.getItem("reportDate");

    if (!reportDate) {
      localStorage.setItem("reportDate", JSON.stringify(date));
    } else {
      const reportDateParse = JSON.parse(reportDate);
      console.log(reportDateParse);
      setStartDate(reportDateParse.startDate);
      setEndDate(reportDateParse.endDate);
    }
  });

  return (
    <IonPage>
      <Header title={t("menu.reports")} backButtonHref={ROUTES.MENU} />
      <IonContent>
        <IonList inset={true}>
          <IonLabel className="text-bold">{t("reports.startDate")}</IonLabel>
          <InputDate value={formatDate(startDate)} isOpen={isStartModalOpen} onClick={handleStartDateClick}></InputDate>
        </IonList>
        <IonModal ref={startDateModalRef} onWillDismiss={() => setStartModalOpen(false)}>
          <IonDatetime
            presentation="date"
            value={startDate}
            max={getCurrentDateTimeISO()}
            onIonChange={handleChangeStartDate}
          />
        </IonModal>

        <IonList inset={true}>
          <IonLabel className="text-bold">{t("reports.endDate")}</IonLabel>
          <InputDate value={formatDate(endDate)} isOpen={isEndModalOpen} onClick={handleEndDateClick}></InputDate>
        </IonList>
        <IonModal ref={endDateModalRef} onWillDismiss={() => setEndModalOpen(false)}>
          <IonDatetime
            presentation="date"
            value={endDate}
            max={getCurrentDateTimeISO()}
            min={startDate}
            onIonChange={handleChangeEndDate}
          />
        </IonModal>

        <IonList inset={true}>
          <MenuListButton title={t("reports.fullReport")} handleItemClick={() => handleItemClick(ROUTES.REPORT)} />
          <MenuListButton
            title={t("reports.individualReports")}
            handleItemClick={() => handleItemClick(ROUTES.REPORTS_INDIVIDUAL)}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};
export default Reports;
