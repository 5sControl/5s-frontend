import { IonButton, IonContent, IonIcon, IonLabel, IonModal } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { EditWhiteIcon, TrashBin } from "../../assets/svg/SVGcomponent";
import Fab from "../../components/fab/Fab";
import { ReactNode, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { deleteDirectory } from "../../api/directory/directory";
import { useCookies } from "react-cookie";

type CardsProps = {
  title?: ReactNode;
  backHref: string;
  editHref: string;
  itemTitle: string;
  deleteCard: (id: number, token: string) => Promise<void>;
};

const Card = ({ title, backHref, editHref, itemTitle, deleteCard }: CardsProps) => {
  const { id } : any = useParams();
  const [cookies] = useCookies(["token"]);
  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const handleDeleteClick = () => {
    setLoading(true);
    deleteCard(Number(id), cookies.token)
      .then(() => history.push(backHref))
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancelClick = () => {
    modal.current?.dismiss();
  };

  return (
    <>
      <div className="card__wrapper">
        <IonLabel>Name</IonLabel>
        <IonLabel className="card__item">{itemTitle}</IonLabel>
      </div>
      <Fab
        icon={EditWhiteIcon}
        handleFabClick={() => {
          handleFabClick(editHref);
        }}
      ></Fab>
      <IonModal ref={modal} trigger="open-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
        <div className="modal__block">
          <h1 className="modal__title">{`Delete "${itemTitle}" ?`}</h1>
          <IonButton size="small" className="modal__button modal__button-red" onClick={handleDeleteClick}>
            Delete
          </IonButton>
          <IonButton size="small" className="modal__button modal__button-white" onClick={handleCancelClick}>
            Cancel
          </IonButton>
        </div>
      </IonModal>
    </>
  );
};
export default Card;