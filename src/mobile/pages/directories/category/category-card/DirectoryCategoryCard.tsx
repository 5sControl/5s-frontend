import { useParams } from "react-router-dom";
import { ROUTES } from "../../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import Card from "../../../../ui/card/Card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { IonContent, IonIcon, IonItem, IonList } from "@ionic/react";
import { DirectoryCategory } from "../../../../models/interfaces/directoryCategory.interface";
import { deleteDirectoryCategory, getDirectoryCategory } from "../../../../api/directory/directoryCategories";
import { Header } from "../../../../components/header/Header";
import { TrashBin } from "../../../../assets/svg/SVGcomponent";
import { Directory } from "../../../../models/interfaces/directory.interface";
import { Preloader } from "../../../../../components/preloader";

const DirectoryCategoryCard = () => {
  const [cookies] = useCookies(["token"]);
  const { refId, id } = useParams() as { refId: string; id: string };
  const { t } = useTranslation();
  const [directory, setDirectory] = useState<DirectoryCategory>();

  useEffect(() => {
    getDirectoryCategory(Number(refId), cookies.token)
      .then(response => {
        const currentCatalog = response.data.find((catalog: Directory) => catalog.id === Number(id));
        setDirectory(currentCatalog);
      })
      .catch(err => console.error(err));
  }, [cookies.token]);

  const deleteCard = async (refId: number, token: string) => {
    deleteDirectoryCategory(refId, token);
  };

  return (
    <IonContent>
      <Header
        title={t("directory.card")}
        backButtonHref={ROUTES.DIRECTORY_CATEGORY(refId)}
        endButton={<IonIcon id="open-modal" style={{ fontSize: "24px" }} icon={TrashBin}></IonIcon>}
      />
      {directory ? (
        <Card
          title={t("directory.card")}
          deleteCard={deleteCard}
          backHref={ROUTES.DIRECTORY_CATEGORY(refId)}
          editHref={ROUTES.DIRECTORY_CATEGORY_EDIT(refId, String(directory.id))}
          itemTitle={directory.name}
        />
      ) : (
        <div className="preloader">
          <Preloader />
        </div>
      )}
    </IonContent>
  );
};
export default DirectoryCategoryCard;
