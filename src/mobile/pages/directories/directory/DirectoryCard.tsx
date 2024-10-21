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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDirectory(Number(id!), cookies.token)
      .then(response => {
        setDirectory(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cookies.token]);

  return loading ? (
    <div className="preloader">
      <Preloader />
    </div>
  ) : directory ? (
    <Card
      title={t("directory.card")}
      backHref={ROUTES.GENEREAL_DIRECTORIES}
      editHref={ROUTES.DIRECTORIES_EDIT_CARD(String(directory.id))}
      itemTitle={directory.name}
    />
  ) : (
    <IonList inset={true}>
      <IonItem>{t("messages.noDatabases")}</IonItem>
    </IonList>
  );
};
export default DirectoryCard;
