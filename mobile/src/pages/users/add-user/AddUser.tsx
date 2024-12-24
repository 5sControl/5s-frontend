import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonList, IonNote, IonPage, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { createUser, getUser, updateUser } from "../../../api/users";
import { IAddUser, IUser } from "../../../models/interfaces/employee.interface";
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

const AddUser = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IAddUser>({username: "", last_name: "", first_name: "", password: "", role: ROLE.WORKER} as IAddUser);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [customRole, setCustomRole] = useState(false);
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
  const minPasswordLength = 4;

  function getUserRole () {
    return localStorage.getItem("userRole");
  };

  const navigateBack = () => {
    history.push(ROUTES.USERS, { direction: "back" });
    dispatch(setSelectedWorkplace(null));
  };

  const handleSave = () => {
    if (user) {
      setLoading(true);
      const data: IAddUser = {
        username: user.username,
        last_name: user.last_name,
        first_name: user.first_name,
        password: user.password,
        role: user.role,
        workplace: user.role === ROLE.WORKER ? selectedWorkplace.id : null
      }
      createUser(data, cookies.token)
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
    if (!user.username || !user.first_name || !user.last_name || user.password.length < minPasswordLength || (!selectedWorkplace && user.role === ROLE.WORKER)
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
    history.push(ROUTES.USER_WORKPLACES, { direction: "forward" });
  }

  return (
    <IonPage>
      <Header title={t("operations.add")} onBackClick={navigateBack} backButtonHref={ROUTES.USERS}></Header>
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
                    value={user?.password || ""} 
                    type="password" 
                    required 
                    handleChange={event => setUser({ ...user, password: event.target.value })}
                    state={highlightRequired && user.password.length < minPasswordLength ? "error" : "neutral" }
                    errorMessage={t("form.passwordLength")}
                    autocomplete="new-password" />

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
                
                <Select value={!customRole ? t("users.role") : user.role} placeholder={!customRole ? t("users.role") : user.role} selectList={roles} handleChange={event => {
                    setUser({ ...user, role: event.target.value });
                    setCustomRole(true)}   
                }/>
                
                {
                  user.role === ROLE.WORKER &&
                  <IonList inset={true}>
                    <MenuListButton 
                      title={selectedWorkplace?.name || t("users.workplace")} 
                      handleItemClick={navigateWorkplaceClick}
                      state={highlightRequired && !selectedWorkplace && user.role === ROLE.WORKER ? "error" : "neutral"}
                      errorMessage={t("form.selectWorkplace")}/>
                </IonList>
                }

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

export default AddUser;
