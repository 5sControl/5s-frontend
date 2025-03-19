import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonList, IonNote, IonPage, IonToast } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { createUser } from "../../../api/users";
import { IAddUser } from "../../../models/interfaces/employee.interface";
import { Input } from "../../../components/inputs/input/Input";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import Select from "../../../components/selects/select/Select";
import { ROLE } from "../../../models/enums/roles.enum";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedWorkplace } from "../../../store/workpaceSlice";
import "../../../styles/common.scss";
import { isInvalidText } from "../../../utils/isInvalidText";
import styles from '../users.module.scss'
import isValidEmail from "../../../utils/isValidEmail";

const AddUser = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IAddUser>({username: "", last_name: "", first_name: "", password: "", email: "", role: ROLE.WORKER} as IAddUser);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [customRole, setCustomRole] = useState(false);
  const [highlightRequired, setHighlightRequired] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [userExists, setUserExists] = useState(false);
  const roles = Object.values(ROLE)
    .filter(role => !(getUserRole() === ROLE.ADMIN && role === ROLE.SUPERUSER))
    .map(role => ({
        id: role,
        label: role,
        value: role
    }));
  const { selectedWorkplace } = useSelector((state: any) => state.workplace);
  const [backOnClose, setBackOnClose] = useState(false);
  const minPasswordLength = 4;

  function getUserRole () {
    return localStorage.getItem("userRole");
  }

  const isChanged =
    ["username", "last_name", "first_name", "password", "email"].some(key => !!user[key]) ||
    selectedWorkplace ||
    user.role != ROLE.WORKER;

  const goBack = () => {
    history.push(ROUTES.USERS, { direction: "back" });
    dispatch(setSelectedWorkplace(null));
  }

  const onNavigateBack = () => {
    if (!isChanged) {
      goBack();
      return;
    }
    setBackOnClose(true);
    setIsOpenModal(true);
  };

  const isFormValid = () => {
    if (
      !user.username ||
      !user.first_name ||
      !user.last_name ||
      !user.email ||
      user.password.length < minPasswordLength ||
      isInvalidText(user.username, { numbers: true, spaces: true }) ||
      isInvalidText(user.first_name) ||
      isInvalidText(user.last_name) ||
      !isValidEmail(user.email) ||
      (user.role === ROLE.WORKER && (!user.work_start_time || !user.work_end_time))
    ) {
      setHighlightRequired(true);
      return false;
    }
    return true;
  }

  const handleSave = () => {
    setBackOnClose(false);
    if (user && isFormValid()) {
      setLoading(true);
      const data: IAddUser = {
        username: user.username,
        email: user.email,
        last_name: user.last_name,
        first_name: user.first_name,
        password: user.password,
        role: user.role,
        workplace: user.role === ROLE.WORKER ? selectedWorkplace?.id ?? null : null,
        work_start_time: user.work_start_time,
        work_end_time: user.work_end_time
      }
      createUser(data, cookies.token)
        .then(() => {
            setUserExists(false);
            setHighlightRequired(false);
            goBack();
        })
        .catch(error => {
            setUserExists(true);
            setHighlightRequired(true);
            console.error(error);
        })
        .finally(() => {
            setLoading(false);
        });
      return;
    }
  };

  const openModal = () => {
    if (!isFormValid()) {
      return;
    }
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    if (backOnClose) {
      goBack();
    }
  };

  const handleConfirmModal = () => {
   setIsOpenModal(false);
    handleSave();
  };

  const navigateWorkplaceClick = () => {
    history.push(ROUTES.USER_WORKPLACES, { direction: "forward" });
  }

  return (
    <IonPage>
      <Header title={t("operations.users.add")} onBackClick={onNavigateBack} backButtonHref={ROUTES.USERS}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <div style={{ height: "calc(100vh - 150px)", overflow: "scroll", paddingBottom: "20px" }}>
              <div className={styles.section}>
                <IonNote className={`ion-padding ${styles.sectionNote}`}>{t("users.settings")}</IonNote>

                <Input
                  label={t("users.username")}
                  value={user?.username || ""}
                  required
                  handleChange={event => setUser({ ...user, username: event.target.value })}
                  state={
                    highlightRequired &&
                    (!user.username || isInvalidText(user.username, { numbers: true }) || userExists)
                      ? "error"
                      : "neutral"
                  }
                  errorMessage={
                    isInvalidText(user.username, { numbers: true })
                      ? t("form.invalidCharacters")
                      : userExists
                      ? t("messages.employeeExists")
                      : t("form.required")
                  }
                  maxLength={30}
                />
                <Input
                  label={t("users.password")}
                  value={user?.password || ""}
                  type="password"
                  required
                  handleChange={event => setUser({ ...user, password: event.target.value })}
                  state={highlightRequired && user.password.length < minPasswordLength ? "error" : "neutral"}
                  errorMessage={t("form.passwordLength")}
                  autocomplete="new-password"
                />
                <Input
                  label={"Email"}
                  value={user?.email || ""}
                  required
                  handleChange={event => setUser({ ...user, email: event.target.value })}
                  state={
                    highlightRequired && (!user.email || !isValidEmail(user.email) || userExists) ? "error" : "neutral"
                  }
                  errorMessage={
                    userExists
                      ? t("messages.employeeExists")
                      : !isValidEmail(user.email)
                      ? t("form.invalidEmail")
                      : t("form.required")
                  }
                  maxLength={30}
                />
              </div>
              <div className={styles.section}>
                <IonNote className={`ion-padding ${styles.sectionNote}`}>{t("users.info")}</IonNote>

                <Input
                  label={t("users.lastName")}
                  value={user?.last_name || ""}
                  required
                  handleChange={event => setUser({ ...user, last_name: event.target.value })}
                  state={highlightRequired && (!user.last_name || isInvalidText(user.last_name)) ? "error" : "neutral"}
                  errorMessage={isInvalidText(user.last_name) ? t("form.invalidCharacters") : t("form.required")}
                  maxLength={30}
                  type="text"
                />
                <Input
                  label={t("users.firstName")}
                  value={user?.first_name || ""}
                  required
                  handleChange={event => setUser({ ...user, first_name: event.target.value })}
                  state={
                    highlightRequired && (!user.first_name || isInvalidText(user.first_name)) ? "error" : "neutral"
                  }
                  errorMessage={isInvalidText(user.first_name) ? t("form.invalidCharacters") : t("form.required")}
                  maxLength={30}
                  type="text"
                />

                <Select
                  value={!customRole ? t("users.role") : user.role}
                  placeholder={!customRole ? t("users.role") : user.role}
                  selectList={roles}
                  handleChange={event => {
                    setUser({ ...user, role: event.target.value });
                    setCustomRole(true);
                  }}
                />

                {user.role === ROLE.WORKER && (
                  <>
                    <IonList inset={true}>
                    <MenuListButton
                      title={selectedWorkplace?.name || t("users.workplace")}
                      handleItemClick={navigateWorkplaceClick}
                    />
                    </IonList>
                    <Input
                    label={t("users.workStartTime")}
                    value={user.work_start_time || ""}
                    handleChange={event => setUser({ ...user, work_start_time: event.target.value })}
                    type="time"
                    required={true}
                    state={highlightRequired && !user.work_start_time ? "error" : "neutral"}
                    errorMessage={t("form.required")}
                    />
                    <Input
                    label={t("users.workEndTime")}
                    value={user.work_end_time || ""}
                    handleChange={event => setUser({ ...user, work_end_time: event.target.value })}
                    type="time"
                    required={true}
                    state={highlightRequired && !user.work_end_time ? "error" : "neutral"}
                    errorMessage={t("form.required")}
                    />
                  </>
                )}
              </div>

              <IonToast
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={TOAST_DELAY}
                onDidDismiss={() => setToastMessage("")}
              />
            </div>
            <BottomButton handleClick={openModal} label={t("operations.save")} disabled={!isChanged} />
          </>
        )}
      </IonContent>
      <ConfirmationModal
        type="primary"
        isOpen={isOpenModal}
        onClose={closeModal}
        onConfirm={handleConfirmModal}
        title={`${t("operations.saveChanges")}?`}
        confirmText={t("operations.save")}
        cancelText={t("operations.cancel")}
      />
    </IonPage>
  );
};

export default AddUser;
