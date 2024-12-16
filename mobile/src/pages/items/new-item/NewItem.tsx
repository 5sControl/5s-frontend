import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { createDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { IonContent, IonPage } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { createItem } from "../../../api/items";

const NewItem = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [itemName, setItemName] = useState("");
  const [initialValue, setInitialValue] = useState(itemName);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useEffect(() => {
    setInitialValue(itemName);
  }, []);

  const navigateBack = () => {
    history.push(ROUTES.ITEMS, { direction: "back" });
  };

  const handleSave = () => {
    if (itemName.trim()) {
      createItem(itemName.trim(), cookies.token)
        .then(() => navigateBack())
        .catch(error => console.error(error));
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
    setItemName(e.target.value);
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
        title={t("directory.items.newItem")}
        onBackClick={handleBackClick}
        backButtonHref={ROUTES.OPERATIONS}
      ></Header>
      <IonContent>
        <SingleInputPage
          title={t("directory.items.newItem")}
          backHref={ROUTES.ITEMS}
          label={t("directory.name")}
          value={itemName}
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
export default NewItem;
