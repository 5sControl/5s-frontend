import { IonContent, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../shared/constants/routes";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useHistory } from "react-router";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setEndReportDate, setReportDate, setStartReportDate } from "../../store/reportDateSlice";
import { formatDateYMD, getCurrentDateTimeISO, getDateWeekAgoISO } from "../../utils/parseInputDate";
import DateSelector from "../../components/dateSelector/DateSelector";
import { Preloader } from "../../components/preloader/preloader";

const Reports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [startDate, setStartDate] = useState<string>(getDateWeekAgoISO());
  const [endDate, setEndDate] = useState<string>(getCurrentDateTimeISO());
  const [loading, setLoading] = useState<boolean>(true);
  const startDateModalRef = useRef<HTMLIonModalElement>(null);
  const endDateModalRef = useRef<HTMLIonModalElement>(null);

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  const handleSaveStartDate = (date: string) => {
    setStartDate(date);
    const currentDate = JSON.parse(localStorage.getItem("reportDate")!);
    currentDate.startDate = date;
    localStorage.setItem("reportDate", JSON.stringify(currentDate));
    dispatch(setStartReportDate(formatDateYMD(date)));
  };

  const handleSaveEndDate = (date: string) => {
    setEndDate(date);
    const currentDate = JSON.parse(localStorage.getItem("reportDate")!);
    currentDate.endDate = date;
    localStorage.setItem("reportDate", JSON.stringify(currentDate));
    dispatch(setEndReportDate(formatDateYMD(date)));
  };

  useIonViewWillEnter(() => {
    const date = {
      startDate,
      endDate,
    };
    dispatch(setReportDate(date));

    const reportDate = localStorage.getItem("reportDate");

    if (!reportDate) {
      localStorage.setItem("reportDate", JSON.stringify(date));
      setLoading(false);
    } else {
      const reportDateParse = JSON.parse(reportDate);
      console.log(reportDateParse);
      setStartDate(reportDateParse.startDate);
      setEndDate(reportDateParse.endDate);
      setLoading(false);
    }
  });

  return (
    <IonPage>
      <Header title={t("menu.reports")} backButtonHref={ROUTES.MENU} />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <DateSelector
              label={t("reports.startDate")}
              setDate={handleSaveStartDate}
              date={startDate}
              modalRef={startDateModalRef}
              maxDate={getCurrentDateTimeISO()}
            />

            <DateSelector
              label={t("reports.endDate")}
              setDate={handleSaveEndDate}
              date={endDate}
              modalRef={endDateModalRef}
              minDate={startDate}
              maxDate={getCurrentDateTimeISO()}
            />

            <IonList inset={true}>
              <MenuListButton title={t("reports.fullReport")} handleItemClick={() => handleItemClick(ROUTES.REPORT)} />
              <MenuListButton
                title={t("reports.individualReports")}
                handleItemClick={() => handleItemClick(ROUTES.REPORTS_INDIVIDUAL)}
              />
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Reports;
