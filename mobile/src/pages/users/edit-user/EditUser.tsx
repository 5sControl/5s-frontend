import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonList, IonNote, IonPage, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { getUser, updateUser } from "../../../api/users";
import { IUpdateUser, IUser } from "../../../models/interfaces/employee.interface";
import { Input } from "../../../components/inputs/input/Input";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import Select from "../../../components/selects/select/Select";
import { ROLE } from "../../../models/enums/roles.enum";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedWorkplace } from "../../../store/workpaceSlice";
import { isInvalidText } from "../../../utils/isInvalidText";
import styles from '../users.module.scss'

const EditUser = () => {
  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [highlightRequired, setHighlightRequired] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const roles = Object.values(ROLE)
    .filter(role => !(getUserRole() === ROLE.ADMIN && role === ROLE.SUPERUSER))
    .map(role => ({
        id: role,
        label: role,
        value: role
    }));
  const { selectedWorkplace } = useSelector((state: any) => state.workplace);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const minPasswordLength = 4;

  function getUserRole () {
    return localStorage.getItem("userRole");
  };

  useIonViewWillEnter(() => {
    setLoading(true);
    getUser(Number(id), cookies.token)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const navigateBack = () => {
    history.push(ROUTES.USER(id), { direction: "back" });
    dispatch(setSelectedWorkplace(null));
  };

  const getUpdatedUser = () => {
    const updatedUser = {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      workplace_id: selectedWorkplace?.id || user.workplace?.id || null
    };
    if (passwordChanged){
      Object.assign(updatedUser, {password: user.password});
    }
    return updatedUser;
  }

  const handleSave = () => {
    if (user) {
      setLoading(true);
      const updatedUser: Partial<IUpdateUser> = getUpdatedUser();
      updateUser(Number(id), updatedUser, cookies.token)
        .then(() => {
          navigateBack();
        })
        .catch(error => {
          setToastMessage(t("messages.employeeExists"));
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }
  };

  const openModal = () => {
    if (!user.username || !user.first_name || !user.last_name || user.password.length < minPasswordLength
      || isInvalidText(user.username, true) || isInvalidText(user.first_name) || isInvalidText(user.last_name)) {
      setHighlightRequired(true);
      return;
    }
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    navigateBack();
  };

  const handleConfirmModal = () => {
    setIsOpenModal(false);
    handleSave();
  };

  const navigateWorkplaceClick = () => {
    updateUser(Number(id), getUpdatedUser(), cookies.token);
    history.push(ROUTES.USER_EDIT_WORKPLACES(id), { direction: "forward" });
  }

  return (
    <IonPage>
      <Header title={t("operations.edit")} onBackClick={openModal} backButtonHref={ROUTES.USER(id)}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
            <>
              <div className={styles.section}>
                <IonNote className={`ion-padding ${styles.sectionNote}`}>
                  {t("users.settings")}
                </IonNote>

                <Input 
                    label={t("users.username")} 
                    value={user?.username || ""} 
                    required 
                    handleChange={event => setUser({ ...user, username: event.target.value })}
                    state={highlightRequired && (!user.username || isInvalidText(user.username, true)) ? "error" : "neutral" }
                    errorMessage={isInvalidText(user.username) ? t("form.invalidCharacters") : t("form.required")}
                    maxLength={30}/>
                <Input 
                    label={t("users.password")} 
                    value={passwordChanged ? user?.password : "password"} 
                    type="password" 
                    hidePassword={true} 
                    required
                    handleChange={event => {
                      setPasswordChanged(true);
                      setUser({ ...user, password: event.target.value })}}
                    state={highlightRequired && user.password.length < minPasswordLength ? "error" : "neutral" }
                    errorMessage={t("form.passwordLength")}
                />
              </div>
              <div className={styles.section}>
                <IonNote className={`ion-padding ${styles.sectionNote}`}>
                  {t("users.info")}
                </IonNote>

                <Input
                    label={t("users.lastName")} 
                    value={user?.last_name || ""} 
                    required 
                    handleChange={event => setUser({ ...user, last_name: event.target.value })}
                    state={highlightRequired && (!user.last_name || isInvalidText(user.last_name)) ? "error" : "neutral" }
                    errorMessage={isInvalidText(user.last_name) ? t("form.invalidCharacters") : t("form.required")}
                    maxLength={30}
                    type="text"/>
                <Input 
                    label={t("users.firstName")} 
                    value={user?.first_name || ""} 
                    required 
                    handleChange={event => setUser({ ...user, first_name: event.target.value })}
                    state={highlightRequired && (!user.first_name || isInvalidText(user.first_name)) ? "error" : "neutral" }
                    errorMessage={isInvalidText(user.first_name) ? t("form.invalidCharacters") : t("form.required")}
                    maxLength={30}
                    type="text"/>

                <IonList inset={true}>
                    <MenuListButton title={selectedWorkplace?.name || user.workplace?.name || t("users.workplace")} handleItemClick={navigateWorkplaceClick}/>
                </IonList>
                <Select value={user.role} placeholder={user.role} selectList={roles} handleChange={event => {
                    setUser({ ...user, role: event.target.value });
                }} />
              </div>
                <IonToast
                    isOpen={!!toastMessage}
                    message={toastMessage || undefined}
                    duration={TOAST_DELAY}
                    onDidDismiss={() => setToastMessage("")}
                />

                <BottomButton
                handleClick={openModal}
                label={t("operations.save")}
                />
            </>
        )}
      </IonContent>
      <ConfirmationModal
        type="primary"
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        title={`${t("operations.saveChanges")}?`}
        confirmText={t("operations.save")}
        cancelText={t("operations.cancel")}
        preventDismiss={true}
      />
    </IonPage>
  );
};

export default EditUser;
