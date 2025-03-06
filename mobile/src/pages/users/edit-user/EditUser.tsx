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
import styles from '../users.module.scss';
import { relative } from "path";
import isValidEmail from "../../../utils/isValidEmail";

const EditUser = () => {
  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser>({} as IUser);
  const [initialUser, setInitialUser] = useState({} as IUser);
  const [isOpenModal, setIsOpenModal] = useState(false);
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [backOnClose, setBackOnClose] = useState(false);
  const minPasswordLength = 4;

  function getUserRole () {
    return localStorage.getItem("userRole");
  }

  useIonViewWillEnter(() => {
    if (user.id) return;
    setLoading(true);
    getUser(Number(id), cookies.token)
      .then(response => {
        setUser(response.data);
        setInitialUser(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const isChanged =
    Object.keys(initialUser).some(key => initialUser[key] != user[key]) ||
    initialUser?.workplace?.id != (selectedWorkplace?.id || user?.workplace?.id) ||
    password ||
    confirmPassword;

  const goBack = () => {
    history.push(ROUTES.USER(id), { direction: "back" });
    dispatch(setSelectedWorkplace(null));
  }

  const onNavigateBack = () => {
    if (!isChanged) {
      goBack();
      return;
    }
    setIsOpenModal(true);
    setBackOnClose(true);
  };

  const getUpdatedUser = () => {
    const updatedUser = {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      email: user.email,
      workplace_id: user.role === ROLE.WORKER ? (selectedWorkplace?.id || user.workplace?.id || null) : null,
      work_start_time: user.work_start_time,
      work_end_time: user.work_end_time
    };
    if (password && password === confirmPassword){
      Object.assign(updatedUser, {password});
    }
    return updatedUser;
  }

  const handleSave = () => {
    setBackOnClose(false);
    if (user && isFormValid()) {
      setLoading(true);
      const updatedUser: Partial<IUpdateUser> = getUpdatedUser();
      setHighlightRequired(true);
      updateUser(Number(id), updatedUser, cookies.token)
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

  const isFormValid = () => {
    if (
      !user.username ||
      !user.first_name ||
      !user.last_name ||
      !user.email ||
      (password && password.length < minPasswordLength) ||
      !isValidEmail(user.email) ||
      isInvalidText(user.username, { numbers: true }) ||
      isInvalidText(user.first_name) ||
      isInvalidText(user.last_name) ||
      password !== confirmPassword
    ) {
      setHighlightRequired(true);
      return false;
    }
    return true;
  }

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
    history.push(ROUTES.USER_EDIT_WORKPLACES(id), { direction: "forward" });
  }

  return (
    <IonPage>
      <Header title={t("operations.users.edit")} onBackClick={onNavigateBack} backButtonHref={ROUTES.USER(id)}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
            <>
            <div style={{height: "calc(100vh - 150px)", overflow: 'scroll', paddingBottom: "20px"}}>
              <div className={styles.section}>
                <IonNote className={`ion-padding ${styles.sectionNote}`}>
                  {t("users.settings")}
                </IonNote>

                <Input 
                    label={t("users.username")} 
                    value={user?.username || ""} 
                    required 
                    handleChange={event => setUser({ ...user, username: event.target.value })}
                    state={highlightRequired && (!user.username || isInvalidText(user.username, {numbers: true})  || userExists) ? "error" : "neutral" }
                    errorMessage={isInvalidText(user.username, {numbers: true})  ? t("form.invalidCharacters") : userExists ? t("messages.employeeExists") : t("form.required")}
                    maxLength={30}/>
                <Input 
                    label={"Email"} 
                    value={user?.email || ""} 
                    required 
                    handleChange={event => setUser({ ...user, email: event.target.value })}
                    state={highlightRequired && (!user.email || !isValidEmail(user.email) || userExists) ? "error" : "neutral" }
                    errorMessage={userExists ? t("messages.employeeExists") : (!isValidEmail(user.email) ? t("form.invalidEmail") : t("form.required"))}
                    maxLength={30}/>  
                <Input 
                    label={t("users.newPassword")} 
                    value={password} 
                    type="password" 
                    hidePassword={false} 
                    required
                    handleChange={event => {
                      setPassword(event.target.value)
                    }}
                    state={highlightRequired && password && password.length < minPasswordLength ? "error" : "neutral" }
                    errorMessage={t("form.passwordLength")}
                />
                <Input 
                    label={t("users.confirmPassword")} 
                    value={confirmPassword} 
                    type="password" 
                    hidePassword={false} 
                    required
                    handleChange={event => {
                      setConfirmPassword(event.target.value)
                    }}
                    state={highlightRequired && password != confirmPassword ? "error" : "neutral" }
                    errorMessage={t("form.passwordsNotEqual")}
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

                <Select value={user.role} placeholder={user.role} selectList={roles} handleChange={event => {
                    setUser({ ...user, role: event.target.value });
                }} />
                {
                  user.role === ROLE.WORKER &&     (
                    <>          
                  <IonList inset={true}>
                    <MenuListButton 
                      title={selectedWorkplace?.name || user.workplace?.name || t("users.workplace")} 
                      handleItemClick={navigateWorkplaceClick}
                      // state={highlightRequired && !(selectedWorkplace || user.workplace?.id) && user.role === ROLE.WORKER ? "error" : "neutral"}
                      // errorMessage={t("form.selectWorkplace")}
                    />
                  </IonList>
                  <Input
                  label={t("users.workStartTime")}
                  value={user.work_start_time || ""}
                  handleChange={event => setUser({ ...user, work_start_time: event.target.value })}
                  type="time"
                  required={false}
                />
                <Input
                  label={t("users.workEndTime")}
                  value={user.work_end_time || ""}
                  handleChange={event => setUser({ ...user, work_end_time: event.target.value })}
                  type="time"
                  required={false}
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
              {/* <div style={{position: "absolute"}}> */}
              <BottomButton
                              handleClick={openModal}
                              label={t("operations.save")}
                              disabled={!isChanged}
                              />
              {/* </div> */}
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

export default EditUser;
