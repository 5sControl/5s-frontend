import { IonContent, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useState } from "react";
import { Preloader } from "../../../components/preloader/preloader";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { formatDateYMD } from "../../../utils/parseInputDate";
import { getReport } from "../../../api/reports";

const FullReport = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["token"]);
  const [report, setReport] = useState();
  const reportDate = useSelector((state: RootState) => state.reportDate);
  const [loading, setLoading] = useState(true);

  const onPressDownload = async () => {
    console.log("download");
    try {
      // Получите файл Excel с сервера
      const response = await fetch("/path/to/your/excel/file"); // Укажите путь к вашему файлу
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Прочитать содержимое файла
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Создаем временный элемент <a> для скачивания
      const a = document.createElement("a");
      a.href = url;
      a.download = "filename.xlsx"; // Задайте имя файла
      document.body.appendChild(a);
      a.click(); // Имитируем клик для скачивания
      document.body.removeChild(a); // Удаляем элемент после скачивания
      window.URL.revokeObjectURL(url); // Освобождаем память
    } catch (error) {
      console.error("Ошибка при получении файла:", error);
    }
  };

  const onPressShare = async () => {
    console.log("share");
    const fileName = "example.txt";
    const fileContent = "Это пример файла для обмена.";
    const blob = new Blob([fileContent], { type: "text/plain" });
    const file = new File([blob], fileName, { type: "text/plain" });

    // Проверяем поддержку Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Поделиться файлом",
          text: "Вот файл, который я хочу с тобой поделиться.",
          files: [file],
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
    console.log("print");
    try {
      // Получите файл Excel с сервера
      const response = await fetch("/path/to/your/excel/file"); // Укажите путь к вашему файлу
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Прочитать содержимое файла
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Открыть файл в новом окне
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print(); // Вызываем печать после загрузки
        };
      }
    } catch (error) {
      console.error("Ошибка при получении файла:", error);
    }
  };

  useIonViewWillEnter(() => {
    setLoading(true);
    // console.log(reportDate);
    const reportDate = localStorage.getItem("reportDate");
    if (reportDate) {
      const date = JSON.parse(reportDate);
      getReport(cookies.token, formatDateYMD(date.startDate), formatDateYMD(date.endDate))
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });

  return (
    <IonPage>
      <Header title={t("reports.fullReport")} backButtonHref={ROUTES.REPORTS} />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <IonList inset={true}>
              <MenuListButton title={t("operations.download")} handleItemClick={onPressDownload} />
              <MenuListButton title={t("operations.share")} handleItemClick={onPressShare} />
              <MenuListButton title={t("operations.print")} handleItemClick={onPressPrint} />
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default FullReport;
