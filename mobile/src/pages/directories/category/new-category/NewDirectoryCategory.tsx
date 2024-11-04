import { ROUTES } from "../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import SingleInputPage from "../../../../ui/signleInputPage/SingleInputPage";
import { useCookies } from "react-cookie";
import { createDirectoryCategory } from "../../../../api/directory/directoryCategories";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../../components/header/Header";
import { getDirectory } from "../../../../api/directory/directory";
import { ConfirmationModal } from "../../../../components/confirmationModal/confirmationModal";

const NewDirectoryCategory = () => {
  const { refId } = useParams() as { refId: string };
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [headerName, setHeaderName] = useState("");
  const [directoryName, setDirectoryName] = useState("");
  const [initialValue, setInitialValue] = useState(directoryName);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useIonViewWillEnter(() => {
    setInitialValue(directoryName);
    setDirectoryName("");
    getDirectory(Number(refId), cookies.token)
      .then(response => {
        const currentCatalog = response.data;
        setHeaderName(currentCatalog.name);
      })
      .catch(error => {
        console.error(error);
      });
  });

  const navigateBack = () => {
    history.push(ROUTES.DIRECTORY_CATEGORY(refId!), { direction: "back" });
  };

  const handleSave = () => {
    if (directoryName) {
      createDirectoryCategory(directoryName, Number(refId), false, cookies.token)
        .then(() => navigateBack())
        .catch(error => console.log(error));
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
        title={`${t("directory.newEntry")} ${headerName ? `"${headerName}"` : ""}`}
        onBackClick={handleBackClick}
        backButtonHref={ROUTES.DIRECTORY_CATEGORY(refId!)}
      />
      <IonContent>
        <SingleInputPage
          backHref={ROUTES.DIRECTORY_CATEGORY(refId!)}
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
export default NewDirectoryCategory;
