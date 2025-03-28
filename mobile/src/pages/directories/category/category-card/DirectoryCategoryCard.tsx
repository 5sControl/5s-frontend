import { useParams } from "react-router-dom";
import { ROUTES } from "../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import Card from "../../../../ui/card/Card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { IonContent, IonIcon, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { DirectoryCategory } from "../../../../models/interfaces/directoryCategory.interface";
import { deleteDirectoryCategory, getDirectoryCategory } from "../../../../api/directory/directoryCategories";
import { Header } from "../../../../components/header/Header";
import { TrashBin } from "../../../../assets/svg/SVGcomponent";
import { Directory } from "../../../../models/interfaces/directory.interface";
import { Preloader } from "../../../../components/preloader/preloader";

const DirectoryCategoryCard = () => {
  const [cookies] = useCookies(["token"]);
  const { refId, id } = useParams() as { refId: string; id: string };
  const { t } = useTranslation();
  const [directory, setDirectory] = useState<DirectoryCategory>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    getDirectoryCategory(Number(refId), cookies.token)
      .then(response => {
        const currentCatalog = response.data.find((catalog: Directory) => catalog.id === Number(id));
        setDirectory(currentCatalog);
      })
      .catch(err => console.error(err));
  });

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleOpenModal = () => {
    setShowConfirmationModal(true);
  };
  // useEffect(() => {
  //   getDirectoryCategory(Number(refId), cookies.token)
  //     .then(response => {
  //       const currentCatalog = response.data.find((catalog: Directory) => catalog.id === Number(id));
  //       setDirectory(currentCatalog);
  //     })
  //     .catch(err => console.error(err));
  // }, [cookies.token]);

  const deleteCard = async (refId: number, token: string) => {
    deleteDirectoryCategory(refId, token);
  };

  return (
    <IonPage>
      <Header
        title={directory?.name}
        backButtonHref={ROUTES.DIRECTORY_CATEGORY(refId)}
        endButton={<IonIcon onClick={handleOpenModal} style={{ fontSize: "24px" }} icon={TrashBin}></IonIcon>}
      />
      <IonContent>
        {directory ? (
          <Card
            deleteCard={deleteCard}
            backHref={ROUTES.DIRECTORY_CATEGORY(refId)}
            editHref={ROUTES.DIRECTORY_CATEGORY_EDIT(refId, String(directory.id))}
            itemTitle={directory.name}
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
export default DirectoryCategoryCard;
