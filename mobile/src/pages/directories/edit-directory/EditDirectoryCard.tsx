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
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";

const EditDirectoryCard = () => {
  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [directoryName, setDirectoryName] = useState("");
  const [initialValue, setInitialValue] = useState(directoryName);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useIonViewWillEnter(() => {
    setInitialValue(directoryName);
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

  const navigateBack = () => {
    history.push(ROUTES.DIRECTORIES_ITEM_CARD(id!), { direction: "back" });
  };

  const handleSave = () => {
    if (directoryName.trim()) {
      updateDirectory(Number(id), directoryName.trim(), cookies.token)
        .then(() => navigateBack())
        .catch(error => {
          console.error(error);
        });
      return;
    }
    console.error("empty input");
  };

  const handleBackClick = () => {
    if (valueIsChanged) {
      setIsOpenModal(true);
    } else {
      navigateBack();
    }
  };

  const handleChangeInput = e => {
    setDirectoryName(e.target.value);
    if (e.target.value.trim() !== initialValue.trim()) {
      setValueIsChanged(true);
    }
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    navigateBack();
  };

  const handleConfirmModal = () => {
    setIsOpenModal(false);
    handleSave();
  };

  return (
    <IonPage>
      <Header
        title={t("directory.edit")}
        onBackClick={handleBackClick}
        backButtonHref={ROUTES.DIRECTORIES_ITEM_CARD(id!)}
      ></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <SingleInputPage
            backHref={ROUTES.DIRECTORIES_ITEM_CARD(id!)}
            label={t("directory.name")}
            value={directoryName}
            required
            handleChange={handleChangeInput}
            handleSave={handleSave}
          />
        )}
      </IonContent>
      <ConfirmationModal
        type="primary"
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        title={`${t("operations.saveChanges")}?`}
        confirmText={t("operations.save")}
        cancelText={t("operations.cancel")}
      />
    </IonPage>
  );
};
export default EditDirectoryCard;
