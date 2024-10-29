import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { useEffect, useState } from "react";
import { getDirectory, updateDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";

const EditDirectoryCard = () => {
  const [cookies] = useCookies(["token"]);
  const { id }: { id: string } = useParams();
  const [directoryName, setDirectoryName] = useState("");
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useIonViewWillEnter(() => {
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
  });

  // useEffect(() => {
  //   setLoading(true);
  //   getDirectory(Number(id!), cookies.token)
  //     .then(response => {
  //       setDirectoryName(response.data.name);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [cookies.token]);

  const handleSave = () => {
    if (directoryName.trim()) {
      updateDirectory(Number(id), directoryName.trim(), cookies.token)
        .then(() => history.push(ROUTES.DIRECTORIES_ITEM_CARD(id!), { direction: "back" }))
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
      <Header title={t("directory.edit")} backButtonHref={ROUTES.DIRECTORIES_ITEM_CARD(id!)}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <SingleInputPage
            backHref={ROUTES.DIRECTORIES_ITEM_CARD(id!)}
            label={t("directory.name")}
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
