import { IonButton, IonContent, IonIcon, IonLabel, IonModal } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { EditWhiteIcon, TrashBin } from "../../assets/svg/SVGcomponent";
import Fab from "../../components/fab/Fab";
import { ReactNode, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteDirectory } from "../../api/directory/directory";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import InputReadonly from "../../components/inputs/inputReadonly/inputReadonly";
import { ConfirmationModal } from "../../components/confirmationModal/confirmationModal";

type CardsProps = {
  backHref: string;
  editHref: string;
  itemTitle: string;
  showConfirmationModal: boolean;
  handleCloseModal: () => void;
  deleteCard: (id: number, token: string) => Promise<void>;
};

const Card = ({ backHref, editHref, itemTitle, showConfirmationModal, deleteCard, handleCloseModal }: CardsProps) => {
  const { id }: any = useParams();
  const { t } = useTranslation();
  const [cookies] = useCookies(["token"]);
  const history = useHistory();

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const handleDeleteClick = () => {
    deleteCard(Number(id), cookies.token)
      .then(() => {
        handleCancelClick();
        history.push(backHref, { direction: "back" });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCancelClick = () => {
    handleCloseModal();
  };

  return (
    <>
      <InputReadonly label={t("directory.name")} value={itemTitle} />
      <Fab
        icon={EditWhiteIcon}
        handleFabClick={() => {
          handleFabClick(editHref);
        }}
      ></Fab>
      <ConfirmationModal
        type="danger"
        isOpen={showConfirmationModal}
        onConfirm={handleDeleteClick}
        onClose={handleCancelClick}
        title={`${t("operations.delete")} "${itemTitle}" ?`}
        confirmText={t("operations.delete")}
        cancelText={t("operations.cancel")}
      />
    </>
  );
};
export default Card;
