import { IonContent, IonItem, IonList, IonPage, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useState } from "react";
import { IEmployee } from "../../../models/interfaces/employee.interface";
import { useParams } from "react-router";
import { useCookies } from "react-cookie";
import { getEmployee } from "../../../api/employees";
import { Preloader } from "../../../components/preloader/preloader";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import { useTranslation } from "react-i18next";
import { formatDateYMD } from "../../../utils/parseInputDate";
import { getEmployeeReport, getOrderEmployeeReport } from "../../../api/reports";
import File from "../../../components/file/File";
import { TOAST_DELAY } from "../../../constants/toastDelay";

const EmployeeReport = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["token"]);
  const [employee, setEmployee] = useState<IEmployee>();
  const { employeeId, orderId }: { employeeId: string; orderId?: string } = useParams();
  const [reportName, setReportName] = useState<string>();
  const [report, setReport] = useState();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const onPressDownload = () => {
    console.log("download");
    try {
      const url = window.URL.createObjectURL(report!);
      const a = document.createElement("a");
      a.href = url;
      a.download = reportName!;
      document.body.appendChild(a);
      a.click();
      console.log(url);
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при получении файла:", error);
      setToastMessage(t("messages.employeeNotFound"));
    }
  };

  const onPressShare = () => {
    console.log("share");
  };
  const onPressPrint = () => {
    console.log("print");
  };

  useIonViewWillEnter(() => {
    const reportDate = localStorage.getItem("reportDate");
    setLoading(true);
    if (reportDate) {
      getEmployee(Number(employeeId), cookies.token)
        .then(response => {
          setEmployee(response.data);

          const date = JSON.parse(reportDate);
          const startReportDate = formatDateYMD(date.startDate);
          const endReportDate = formatDateYMD(date.endDate);
          setReportName(
            `${response.data.name}_${startReportDate}_to_${endReportDate}${orderId ? "_assembly" : ""}.xlsx`
          );
          if (orderId) {
            return getOrderEmployeeReport(cookies.token, startReportDate, endReportDate, orderId, employeeId);
          } else {
            return getEmployeeReport(cookies.token, startReportDate, endReportDate, employeeId);
          }
        })
        .then(response => {
          console.log(response);
          setReport(response.data);
        })
        .catch(error => {
          console.warn(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });

  return (
    <IonPage>
      <Header
        title={employee?.name}
        backButtonHref={orderId ? ROUTES.REPORT_ORDER_INDIVIDUAL(orderId) : ROUTES.REPORT_INDIVIDUAL}
      />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : report ? (
          <>
            <File fileName={reportName!} />
            <IonList inset={true}>
              <MenuListButton title={t("operations.download")} handleItemClick={onPressDownload} />
              {/* <MenuListButton title={t("operations.share")} handleItemClick={onPressShare} /> */}
              {/* <MenuListButton title={t("operations.print")} handleItemClick={onPressPrint} /> */}
            </IonList>
          </>
        ) : (
          <IonList inset={true}>
            <IonItem>{t("messages.noReports")}</IonItem>
          </IonList>
        )}
      </IonContent>

      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
    </IonPage>
  );
};
export default EmployeeReport;
