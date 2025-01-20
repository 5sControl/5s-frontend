import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import SingleInputPage from "../../../../ui/signleInputPage/SingleInputPage";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../../components/preloader/preloader";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../../components/header/Header";
import { getDirectoryCategory, updateDirectoryCategory } from "../../../../api/directory/directoryCategories";
import { Directory } from "../../../../models/interfaces/directory.interface";
import { ConfirmationModal } from "../../../../components/confirmationModal/confirmationModal";

const EditDirectoryCategory = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["token"]);
  const { refId, id } = useParams() as { refId: string; id: string };
  const [directoryName, setDirectoryName] = useState("");
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [initialValue, setInitialValue] = useState(directoryName);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useIonViewWillEnter(() => {
    setInitialValue(directoryName);
    setLoading(true);
    getDirectoryCategory(Number(refId), cookies.token)
      .then(response => {
        const currentCatalog = response.data.find((catalog: Directory) => catalog.id === Number(id));
        setDirectoryName(currentCatalog.name);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const navigateBack = () => {
    history.push(ROUTES.DIRECTORY_CATEGORY_CARD(refId, id), { direction: "back" });
  };

  const handleSave = async () => {
    if (directoryName.trim()) {
      updateDirectoryCategory(Number(id), Number(refId), directoryName.trim(), cookies.token)
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
      return;
    }
    navigateBack();
  };

  const handleChangeInput = e => {
    setDirectoryName(e.target.value);
    if (e.target.value.trim() !== initialValue.trim()) {
      setValueIsChanged(true);
      return;
    }
    setValueIsChanged(false);
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
        backButtonHref={ROUTES.DIRECTORY_CATEGORY_CARD(refId, id)}
      ></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <SingleInputPage
            backHref={ROUTES.DIRECTORY_CATEGORY_CARD(refId, id)}
            label={t("directory.name")}
            value={directoryName!}
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
export default EditDirectoryCategory;
