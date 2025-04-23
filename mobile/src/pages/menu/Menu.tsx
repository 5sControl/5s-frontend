import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { IonContent, IonFooter, IonList, IonPage, IonText, useIonViewWillEnter } from "@ionic/react";
import { getCurrentUserInfo } from "../../api/users";
import { ROUTES } from "../../shared/constants/routes";
import { Header } from "../../components/header/Header";
import { DollarSign, MenuLogo, Orders } from "../../assets/svg/SVGcomponent";
import { Logout } from "../../components/logout/Logout";
import { useTranslation } from "react-i18next";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import Restricted from "../../providers/permissionProvider/Restricted";
import { isMobile } from "react-device-detect";
import "./Menu.scss";
import { Preloader } from "../../components/preloader/preloader";
import { ITimespan } from "../../models/interfaces/orders.interface";
import { TIMESPAN_REQUEST } from "../../dispatcher";
import { APP_VERSION } from "../../config";
import { IUser } from "../../models/interfaces/employee.interface";

export const Menu: React.FC = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState<IUser | null>(null);
  const [timespans, setTimespans] = useState<ITimespan[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const history = useHistory();
  const { t } = useTranslation();
  const workInProgress = timespans[0] && !timespans[0].finishedAt;

  useIonViewWillEnter( () => {
    if (!cookies.token) return;
    (async () => {
      try {
        const response = await getCurrentUserInfo(cookies.token);
        if (response?.data) {
          const userData = response.data;
          setUser(userData);

          if (userData.role === "worker") {
            TIMESPAN_REQUEST.getTimespansByEmployee(
              userData.id,
              setTimespans,
              setLoading,
              setToastMessage
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    })();
  });

  const handleItemClick = (path: string) => history.push(path);

  const logout = () => removeCookie("token", { path: "/" });

  return (
    <IonPage>
      <Header
        title={
          <div className="main__header">
            <img src={MenuLogo} alt="Menu Logo" />
          </div>
        }
      />
      <IonContent color="light">
        {!user ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <Logout username={user.username} logout={logout} />

            <Restricted to="view_order">
              <IonList inset={true}>
                <MenuListButton
                  icon={Orders}
                  title={t("menu.orders")}
                  handleItemClick={() => handleItemClick(ROUTES.ORDERS)}
                />
                <MenuListButton
                  icon={DollarSign}
                  title={t("menu.reports")}
                  handleItemClick={() => handleItemClick(ROUTES.REPORTS)}
                />
                <MenuListButton
                  title={t("menu.employeeTasksStatus")}
                  handleItemClick={() => handleItemClick(ROUTES.EMPLOYEE_TASKS_STATUS)}
                />
              </IonList>
            </Restricted>

            <IonList inset={true}>
              <Restricted to="view_users">
                <MenuListButton
                  title={t("menu.users")}
                  handleItemClick={() => handleItemClick(ROUTES.USERS)}
                />
              </Restricted>
              <Restricted to="view_reference">
                <MenuListButton
                  title={t("menu.directories")}
                  handleItemClick={() => handleItemClick(ROUTES.DIRECTORIES)}
                />
              </Restricted>
              <Restricted to="view_reference">
                <MenuListButton
                  title={t("menu.dataConfiguration")}
                  handleItemClick={() => handleItemClick(ROUTES.CONFIGURATION)}
                />
              </Restricted>
              {!isMobile && (
                <Restricted to="view_cameras">
                  <MenuListButton
                    title={t("menu.cameras")}
                    handleItemClick={() => handleItemClick(ROUTES.CAMERAS)}
                  />
                </Restricted>
              )}
            </IonList>

            <Restricted to="proccess_qr_code_order_operation">
              <IonList inset={true}>
                <MenuListButton
                  title={t("menu.scanner")}
                  handleItemClick={() => handleItemClick(ROUTES.SCANNER_QR)}
                  disabled={workInProgress}
                />

                <div className="my-work-btn">
                  <MenuListButton
                    lines="none"
                    title={t("menu.myTasks")}
                    handleItemClick={() => handleItemClick(ROUTES.EMPLOYEE_TASKS(String(user.id)))}
                  />
                  <div className={"status " + (workInProgress ? "work" : "no-work")}>
                    {workInProgress
                      ? t("menu.workStatus.workInProgress")
                      : t("menu.workStatus.noWork")}
                  </div>
                </div>
              </IonList>
            </Restricted>

            <IonList inset={true}>
              <MenuListButton
                title={t("menu.language")}
                handleItemClick={() => handleItemClick(ROUTES.LANGUAGE)}
              />
            </IonList>

            <IonFooter className="footer">
              <IonText>{`Version ${APP_VERSION}`}</IonText>
            </IonFooter>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Menu;

