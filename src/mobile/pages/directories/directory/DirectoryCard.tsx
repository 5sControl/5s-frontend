import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import "./DirectoryCard.scss";
import Card from "../../../ui/card/Card";
import { useEffect, useState } from "react";
import { deleteDirectory, getDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Directory } from "../../../models/interfaces/directory.interface";
import { Preloader } from "../../../../components/preloader";
import { IonContent, IonIcon, IonItem, IonList } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { TrashBin } from "../../../assets/svg/SVGcomponent";
import { title } from "process";

const DirectoryCard = () => {
  const [cookies] = useCookies(["token"]);
  const { id } = useParams();
  const { t } = useTranslation();
  const [directory, setDirectory] = useState<Directory>();
  const navigate = useNavigate();

  useEffect(() => {
    getDirectory(Number(id!), cookies.token)
      .then(response => {
        setDirectory(response.data);
      })
      .catch(error => console.error(error));
  }, [cookies.token]);

  const deleteCard = async (id: number, token: string) => {
    deleteDirectory(id, token);
  };

  return (
    <IonContent>
      <Header
        title={t("directory.card")}
        backButtonHref={ROUTES.GENEREAL_DIRECTORIES}
        endButton={<IonIcon id="open-modal" icon={TrashBin}></IonIcon>}
      />
      {directory ? (
        <Card
          deleteCard={deleteCard}
          backHref={ROUTES.GENEREAL_DIRECTORIES}
          editHref={ROUTES.DIRECTORIES_EDIT_CARD(String(id))}
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
export default DirectoryCard;
