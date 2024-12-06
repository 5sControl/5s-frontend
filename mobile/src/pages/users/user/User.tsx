import { useHistory, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import Card from "../../../ui/card/Card";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonIcon, IonInput, IonItem, IonLabel, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { getItem } from "../../../api/items";
import { deleteUser, getUser } from "../../../api/users";
import { IUser } from "../../../models/interfaces/employee.interface";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { EditWhiteIcon, TrashBin } from "../../../assets/svg/SVGcomponent";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import Chip from "../../../components/chip/chip";
import RoleLabel from "../../../components/roleLabel/RoleLabel";
import Fab from "../../../components/fab/Fab";

const User = () => {
  const [cookies] = useCookies(["token"]);
  const { id }: { id: string } = useParams();
  const { t } = useTranslation();
  const [item, setItem] = useState<IUser>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const history = useHistory();

  useIonViewWillEnter(() => {
    getUser(Number(id), cookies.token)
      .then(response => {
        setItem(response.data);
      })
      .catch(error => console.error(error));
  });

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleOpenModal = () => {
    setShowConfirmationModal(true);
  };

  const deleteCard = async (id: number, token: string) => {
    deleteUser(id, token);
  };

  const handleFabClick = () => {
    history.push(ROUTES.USER_EDIT(id));
  }

  const handleDeleteClick = () => {
    deleteCard(Number(id), cookies.token)
      .then(() => {
        handleCancelClick();
        history.push(ROUTES.USERS, { direction: "back" });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCancelClick = () => {
    handleCloseModal();
  };

  return (
    <IonPage>
      <Header 
        title={item?.username} 
        backButtonHref={ROUTES.USERS} 
        endButton={<IonIcon onClick={handleOpenModal} style={{ fontSize: "24px" }} icon={TrashBin}></IonIcon>}/>
      <IonContent>
        {item ? (
            <>
                <InputReadonly label={t("users.username")} value={item.username} />
                <InputReadonly label={t("users.fullName")} value={`${item.first_name} ${item.last_name}`} />
                <InputReadonly label={t("users.workplace")} value={item.workplace?.name || '-'} />
                <IonItem className="input__field">
                        <IonLabel className="input__label">{t("users.role")}</IonLabel>
                        <RoleLabel role={item.role} />
                </IonItem>

                <Fab
                    icon={EditWhiteIcon}
                    handleFabClick={handleFabClick}/>

                <ConfirmationModal
                    type="danger"
                    isOpen={showConfirmationModal}
                    onConfirm={handleDeleteClick}
                    onClose={handleCancelClick}
                    title={`${t("operations.delete")} "${item.username}" ?`}
                    confirmText={t("operations.delete")}
                    cancelText={t("operations.cancel")}
                />
          </>
        ) : (
          <div className="preloader">
            <Preloader />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
export default User;
