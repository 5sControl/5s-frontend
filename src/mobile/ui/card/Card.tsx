import { IonButton, IonContent, IonIcon, IonLabel, IonModal } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { EditWhiteIcon, TrashBin } from "../../assets/svg/SVGcomponent";
import Fab from "../../components/fab/Fab";
import { ReactNode, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteDirectory } from "../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader";

type CardsProps = {
  title: ReactNode;
  backHref: string;
  editHref: string;
  itemTitle: string;
};

const Card = ({ title, backHref, editHref, itemTitle }: CardsProps) => {
  const { id } = useParams();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const modal = useRef<HTMLIonModalElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFabClick = (path: string) => {
    navigate(path);
  };

  const handleDeleteClick = () => {
    setLoading(true);
    deleteDirectory(Number(id), cookies.token)
      .then(() => navigate(backHref))
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

  return loading ? (
    <div className="preloader">
      <Preloader />
    </div>
  ) : (
    <IonContent>
      <Header title={title} backButtonHref={backHref} endButton={<IonIcon id="open-modal" icon={TrashBin}></IonIcon>} />
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
          <h1 className="modal__title">Delete {itemTitle}</h1>
          <IonButton size="small" className="modal__button modal__button-red" onClick={handleDeleteClick}>
            Delete
          </IonButton>
          <IonButton size="small" className="modal__button modal__button-white" onClick={handleCancelClick}>
            Cancel
          </IonButton>
        </div>
      </IonModal>
    </IonContent>
  );
};
export default Card;
