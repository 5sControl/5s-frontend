import { useHistory, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import "./DirectoryCard.scss";
import Card from "../../../ui/card/Card";
import { useEffect, useState } from "react";
import { deleteDirectory, getDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Directory } from "../../../models/interfaces/directory.interface";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonIcon, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { TrashBin } from "../../../assets/svg/SVGcomponent";

const DirectoryCard = () => {
  const [cookies] = useCookies(["token"]);
  const { id }: any = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const [directory, setDirectory] = useState<Directory>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    getDirectory(Number(id!), cookies.token)
      .then(response => {
        setDirectory(response.data);
      })
      .catch(error => console.error(error));
  });

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleOpenModal = () => {
    setShowConfirmationModal(true);
  };

  // useEffect(() => {
  //   getDirectory(Number(id!), cookies.token)
  //     .then(response => {
  //       setDirectory(response.data);
  //     })
  //     .catch(error => console.error(error));
  // }, [cookies.token]);

  const deleteCard = async (id: number, token: string) => {
    deleteDirectory(id, token);
  };

  return (
    <IonPage>
      <Header
        title={directory?.name}
        backButtonHref={ROUTES.GENEREAL_DIRECTORIES}
        endButton={<IonIcon onClick={handleOpenModal} style={{ fontSize: "24px" }} icon={TrashBin}></IonIcon>}
      />
      <IonContent>
        {directory ? (
          <Card
            deleteCard={deleteCard}
            itemTitle={directory.name}
            backHref={ROUTES.GENEREAL_DIRECTORIES}
            editHref={ROUTES.DIRECTORIES_EDIT_CARD(String(id))}
            showConfirmationModal={showConfirmationModal}
            handleCloseModal={handleCloseModal}
          />
        ) : (
          <div className="preloader">
            <Preloader />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
export default DirectoryCard;
