import React, { useEffect, useState } from "react";
import { IonContent, IonPage, IonList, IonItem, IonLabel, IonLoading } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import styles from "./EmployeeTasksStatus.module.scss";
import { TIMESPAN_API } from "../../../api/orders";
import { getUserList } from "../../../api/users";
import { ROUTES } from "../../../shared/constants/routes";
import { Header } from "../../../components/header/Header";

interface Employee {
  id: number;
  username: string;
  role: string;
}

interface OrderOperation {
  name: string;
  id: number;
  orderItem: {
    id: number;
    order: {
      id: number;
      orderNumber: number;
    };
  };
}

interface Timespan {
  timespanId: number;
  startedAt: string;
  finishedAt: string | null;
  orderOperation: OrderOperation;
  employeeId: number;
  employeeName: string;
}

export const EmployeeTasksStatus: React.FC = () => {
  const [cookies] = useCookies(["token"]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timespans, setTimespans] = useState<Timespan[]>([]);
  const [isLoading, setLoading] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await getUserList(cookies.token);
        const filteredEmployees = response.data.filter((employee: Employee) => employee.role !== "admin");
        setEmployees(filteredEmployees);

        const allTimespans: Timespan[] = [];

        for (const employee of filteredEmployees) {
          try {
            const response = await TIMESPAN_API.getTimespansByEmployee(employee.id);
            const employeeTimespans = response.data.filter(
              (timespan: Timespan) => timespan.finishedAt === null
            );
            employeeTimespans.forEach((timespan: Timespan) => {
              timespan.employeeName = employee.username;
            });
            allTimespans.push(...employeeTimespans);
          } catch (error) {
            console.error(`Error fetching timespans for employee ${employee.id}:`, error);
          }
        }

        setTimespans(allTimespans);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [cookies.token]);

  const getEmployeeTimespan = (employeeId: number) => {
    return timespans.filter((timespan) => timespan.employeeId === employeeId);
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const aHas = getEmployeeTimespan(a.id).length > 0;
    const bHas = getEmployeeTimespan(b.id).length > 0;
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return 0;
  });

  return (
    <IonPage>
      <Header title={t("menu.employeeTasksStatus")} backButtonHref={ROUTES.MENU} />
      <IonContent>
        <IonLoading isOpen={isLoading} message={t("menu.loading")} />
        {!isLoading && (
          <IonList className={styles.table}>
            <IonItem className={styles.headerItem}>
              <IonLabel>{t("employee")}</IonLabel>
              <IonLabel>{t("order")}</IonLabel>
              <IonLabel>{t("operation")}</IonLabel>
              <IonLabel>{t("timespan")}</IonLabel>
            </IonItem>
            {sortedEmployees.map((employee) => {
              const employeeTimespans = getEmployeeTimespan(employee.id);
              const orderNumber = employeeTimespans.length > 0
                ? employeeTimespans[0].orderOperation.orderItem.order.orderNumber
                : "-";
              const operationName = employeeTimespans.length > 0
                ? employeeTimespans[0].orderOperation.name
                : "-";
              const timespanLink = employeeTimespans.length > 0
                ? (
                    <a href={`/mobile${ROUTES.ORDER_TIMESPAN_EDIT(
                      String(employeeTimespans[0].orderOperation.orderItem.order.id),
                      String(employeeTimespans[0].orderOperation.orderItem.id),
                      String(employeeTimespans[0].orderOperation.id),
                      String(employeeTimespans[0].timespanId)
                    )}`}>
                      {t("menu.viewTimespan")}
                    </a>
                  )
                : "-";
              const nameClass = employeeTimespans.length > 0 ? styles.greenText : styles.redText;
              const rowClass = employeeTimespans.length > 0
                ? employeeTimespans[0].startedAt
                  ? "greenBackground"
                  : "redBackground"
                : "redBackground";

              return (
                <IonItem key={employee.id} className={rowClass}>
                  <IonLabel className={nameClass}>{employee.username}</IonLabel>
                  <IonLabel>{orderNumber}</IonLabel>
                  <IonLabel>{operationName}</IonLabel>
                  <IonLabel>{timespanLink}</IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EmployeeTasksStatus;
