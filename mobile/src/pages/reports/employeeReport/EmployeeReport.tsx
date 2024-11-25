import { IonContent, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
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
import { RootState } from "../../../store";
import { useSelector } from "react-redux";

const EmployeeReport = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["token"]);
  const [employee, setEmployee] = useState<IEmployee>();
  const { employeeId }: { employeeId: string } = useParams();
  const reportDate = useSelector((state: RootState) => state.reportDate);
  const [loading, setLoading] = useState(false);

  const onPressDownload = () => {
    console.log("download");
  };
  const onPressShare = () => {
    console.log("share");
  };
  const onPressPrint = () => {
    console.log("print");
  };

  useIonViewWillEnter(() => {
    console.log(reportDate);
    getEmployee(Number(employeeId), cookies.token)
      .then(response => {
        setEmployee(response.data);
      })
      .catch(error => console.error(error));
  });

  return (
    <IonPage>
      <Header title={employee?.name} backButtonHref={ROUTES.REPORTS_INDIVIDUAL} />
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
export default EmployeeReport;
