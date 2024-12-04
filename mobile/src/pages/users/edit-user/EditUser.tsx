import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { getUser, updateUser } from "../../../api/users";
import { IUser } from "../../../models/interfaces/employee.interface";
import { Input } from "../../../components/inputs/input/Input";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import Select from "../../../components/selects/select/Select";
import { ROLE } from "../../../models/enums/roles.enum";
import BottomButton from "../../../components/bottomButton/BottomButton";

const EditUser = () => {
  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);
  const [customRole, setCustomRole] = useState(false);
  const [highlightRequired, setHighlightRequired] = useState(false);
  const roles = Object.values(ROLE).map(role => ({
    label: role,
    value: role
}));

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
  };

  const handleSave = () => {
    if (user) {
      updateUser(Number(id), user, cookies.token)
        .then(() => navigateBack())
        .catch(error => {
          console.error(error);
        });
      return;
    }
  };

  const openModal = () => {
    if (!user.username || !user.password) {
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
                    label={t("users.username")} 
                    value={user.username} 
                    required 
                    handleChange={value => setUser({ ...user, username: value })}
                    state={highlightRequired && !user.username ? "error" : "neutral" }
                    errorMessage={t("form.required")}
                />
                <Input label={t("users.lastName")} value={user.last_name} required handleChange={value => setUser({ ...user, last_name: value })}/>
                <Input label={t("users.firstName")} value={user.first_name} required handleChange={value => setUser({ ...user, first_name: value })}/>
                
                <Input 
                    label={t("users.password")} 
                    value="password" 
                    type="password" 
                    hidePassword={true} 
                    required 
                    handleChange={value => setUser({ ...user, password: value })}
                    state={highlightRequired && !user.password ? "error" : "neutral" }
                    errorMessage={t("form.required")}
                />
                
                <IonList inset={true}>
                    <MenuListButton title={t("users.workplace")} handleItemClick={() => {}}/>
                </IonList>
                <Select value={!customRole ? t("users.role") : user.role} placeholder={!customRole ? t("users.role") : user.role} selectList={roles} handleChange={event => {
                    setUser({ ...user, role: event.target.value });
                    setCustomRole(true)}   
                }/>

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
