import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { createDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { IonContent, IonPage, IonToast, useIonViewWillLeave } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";

const NewDirectory = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [directoryName, setDirectoryName] = useState("");
  const [initialValue, setInitialValue] = useState(directoryName);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useEffect(() => {
    setInitialValue(directoryName);
  }, []);

  const handleSave = () => {
    if (directoryName.trim()) {
      createDirectory(directoryName.trim(), false, cookies.token)
        .then(() => history.push(ROUTES.GENEREAL_DIRECTORIES, { direction: "back" }))
        .catch(error => console.error(error));
      return;
    }
    console.error("empty input");
  };

  const navigateBack = () => {
    history.push(ROUTES.GENEREAL_DIRECTORIES, { direction: "back" });
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
        title={t("directory.newDirectory")}
        onBackClick={handleBackClick}
        backButtonHref={ROUTES.GENEREAL_DIRECTORIES}
      ></Header>
      <IonContent>
        <SingleInputPage
          title={t("directory.newDirectory")}
          backHref={ROUTES.GENEREAL_DIRECTORIES}
          label={t("directory.name")}
          value={directoryName}
          required
          handleChange={handleChangeInput}
          handleSave={handleSave}
        />
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
export default NewDirectory;
