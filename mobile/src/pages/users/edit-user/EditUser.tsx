import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonList, IonPage, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { getUser, updateUser } from "../../../api/users";
import { IAddUser, IUser } from "../../../models/interfaces/employee.interface";
import { Input } from "../../../components/inputs/input/Input";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import Select from "../../../components/selects/select/Select";
import { ROLE } from "../../../models/enums/roles.enum";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedWorkplace } from "../../../store/workpaceSlice";

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
  const roles = Object.values(ROLE).map(role => ({
    id: role,
    label: role,
    value: role
}));
  const { selectedWorkplace } = useSelector((state: any) => state.workplace);
  const [passwordChanged, setPasswordChanged] = useState(false);

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

  const handleSave = () => {
    if (user) {
      const updatedUser: Partial<IAddUser> = {
        username: `${user.first_name}_${user.last_name}`,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        workplace: selectedWorkplace || user.workplace || null
      }
      if (passwordChanged){
        Object.assign(updatedUser, {password: user.password});
      }
      updateUser(Number(id), updatedUser, cookies.token)
        .then(() => {
          navigateBack();

        })
        .catch(error => {
          setToastMessage(t("messages.employeeExists"));
          console.error(error);
        });
      return;
    }
  };

  const openModal = () => {
    if (!user.first_name || !user.last_name || !user.password) {
        setHighlightRequired(true);
        return;
    }
    setIsOpenModal(true);
  };

  const handleBackClick = () => {
      navigateBack();
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
      <Header title={t("operations.edit")} onBackClick={handleBackClick} backButtonHref={ROUTES.USER(id)}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
            <>
                <Input 
                    label={t("users.lastName")} 
                    value={user?.last_name || ""} 
                    required 
                    handleChange={event => setUser({ ...user, last_name: event.target.value })}
                    state={highlightRequired && !user.last_name ? "error" : "neutral" }
                    errorMessage={t("form.required")}/>
                <Input 
                    label={t("users.firstName")} 
                    value={user?.first_name || ""} 
                    required 
                    handleChange={event => setUser({ ...user, first_name: event.target.value })}
                    state={highlightRequired && !user.first_name ? "error" : "neutral" }
                    errorMessage={t("form.required")}/>

                <Input 
                    label={t("users.password")} 
                    value="password" 
                    type="password" 
                    hidePassword={true} 
                    required 
                    handleChange={value => {
                      setPasswordChanged(true);
                      setUser({ ...user, password: value })}}
                    state={highlightRequired && !user.password ? "error" : "neutral" }
                    errorMessage={t("form.required")}
                />
                
                <IonList inset={true}>
                    <MenuListButton title={selectedWorkplace?.name || user.workplace?.name || t("users.workplace")} handleItemClick={navigateWorkplaceClick}/>
                </IonList>
                <Select value={user.role} placeholder={user.role} selectList={roles} handleChange={event => {
                    setUser({ ...user, role: event.target.value });
                }} />

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
      />
    </IonPage>
  );
};

export default EditUser;
