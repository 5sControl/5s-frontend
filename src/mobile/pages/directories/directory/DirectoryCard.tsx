import { useParams } from "react-router-dom";
import { ROUTES } from "../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import "./DirectoryCard.scss";
import Card from "../../../ui/card/Card";
import { useEffect, useState } from "react";
import { getDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Directory } from "../../../models/interfaces/directory.interface";
import { Preloader } from "../../../../components/preloader";
import { IonItem, IonList } from "@ionic/react";

const DirectoryCard = () => {
  const [cookies] = useCookies(["token"]);
  const { id } = useParams();
  const { t } = useTranslation();
  const [directory, setDirectory] = useState<Directory>();

  useEffect(() => {
    getDirectory(Number(id!), cookies.token)
      .then(response => {
        setDirectory(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [cookies.token]);

  return directory ? (
    <Card
      title={t("directory.card")}
      backHref={ROUTES.GENEREAL_DIRECTORIES}
      editHref={ROUTES.DIRECTORIES_EDIT(String(directory.id))}
      itemTitle={directory.name}
    />
  ) : (
    <IonList inset={true}>
      <IonItem>{t("messages.noDatabases")}</IonItem>
    </IonList>
  );
};
export default DirectoryCard;
