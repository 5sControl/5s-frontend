import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../../shared/constants/routes";
import { useNavigate, useParams } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { useEffect, useState } from "react";
import { getDirectory, updateDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../../components/preloader";
import { IonContent, IonPage } from "@ionic/react";
import { Header } from "../../../components/header/Header";

const EditDirectoryCard = () => {
  const [cookies] = useCookies(["token"]);
  const { id } = useParams();
  const [directoryName, setDirectoryName] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDirectory(Number(id!), cookies.token)
      .then(response => {
        setDirectoryName(response.data.name);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cookies.token]);

  const handleSave = () => {
    if (directoryName.trim()) {
      updateDirectory(Number(id), directoryName.trim(), cookies.token)
        .then(() => navigate(ROUTES.DIRECTORIES_ITEM_CARD(id!)))
        .catch(error => {
          console.error(error);
        });
      return;
    }
    console.error("empty input");
  };

  const { t } = useTranslation();
  return (
    <IonPage>
      <IonContent>
        <Header title={t("directory.editCard")} backButtonHref={ROUTES.DIRECTORIES_ITEM_CARD(id!)}></Header>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <SingleInputPage
            backHref={ROUTES.DIRECTORIES_ITEM_CARD(id!)}
            label={t("newConnection.name")}
            value={directoryName!}
            required
            handleChange={e => {
              setDirectoryName(e.target.value);
            }}
            handleSave={handleSave}
          />
        )}
      </IonContent>
    </IonPage>
  );
};
export default EditDirectoryCard;
