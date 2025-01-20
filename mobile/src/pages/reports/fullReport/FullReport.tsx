import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useState } from "react";
import { Preloader } from "../../../components/preloader/preloader";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { formatDateYMD } from "../../../utils/parseInputDate";
import { getOrderReport, getReport } from "../../../api/reports";
import File from "../../../components/file/File";
import { useParams } from "react-router";

const FullReport = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["token"]);
  const [reportName, setReportName] = useState<string>();
  const [report, setReport] = useState();
  const [loading, setLoading] = useState(true);
  const { orderId }: { orderId?: string } = useParams();

  const onPressDownload = async () => {
    try {
      const url = window.URL.createObjectURL(report!);
      const a = document.createElement("a");
      a.href = url;
      a.download = reportName!;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при получении файла:", error);
    }
  };

  const onPressShare = async () => {
    const url = window.URL.createObjectURL(report!);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Поделиться файлом",
          text: url,
        });
        console.log("Файл успешно отправлен!");
      } catch (error) {
        console.error("Ошибка при отправке файла:", error);
      }
    } else {
      console.log("Web Share API не поддерживается в этом браузере.");
    }
  };

  const onPressPrint = async () => {
    try {
      const url = window.URL.createObjectURL(report!);
      console.log(url);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error("Ошибка при получении файла:", error);
    }
  };

  useIonViewWillEnter(() => {
    setLoading(true);
    const reportDate = localStorage.getItem("reportDate");
    if (reportDate) {
      const date = JSON.parse(reportDate);
      const startReportDate = formatDateYMD(date.startDate);
      const endReportDate = formatDateYMD(date.endDate);
      setReportName(`${startReportDate}_to_${endReportDate}${orderId ? "_assembly" : ""}.xlsx`);

      if (orderId) {
        getOrderReport(cookies.token, startReportDate, endReportDate, orderId)
          .then(response => {
            setReport(response.data);
          })
          .catch(error => {
            console.warn(error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        getReport(cookies.token, startReportDate, endReportDate)
          .then(response => {
            setReport(response.data);
          })
          .catch(error => {
            console.warn(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  });

  return (
    <IonPage>
      <Header
        title={t("reports.fullReport")}
        backButtonHref={orderId ? ROUTES.REPORT_ORDERS : ROUTES.REPORTS}
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
              {/* <MenuListButton title={t("operations.share")} handleItemClick={onPressShare} /> 
              <MenuListButton title={t("operations.print")} handleItemClick={onPressPrint} /> */}
            </IonList>
          </>
        ) : (
          <IonList inset={true}>
            <IonItem>{t("messages.noReports")}</IonItem>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};
export default FullReport;
