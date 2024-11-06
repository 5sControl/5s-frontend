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
import { createOperation } from "../../../api/operations";
import { TimeUnit } from "../../../models/types/timeUnit";

const NewOperation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [operationName, setOperationName] = useState("");
  const [initialValue, setInitialValue] = useState(operationName);
  const [estimatedTime, setEstimatedTime] = useState<number>(30);
  const [estimatedTimeUnit, setEstimatedTimeUnit] = useState<TimeUnit>("minutes");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useEffect(() => {
    setInitialValue(operationName);
  }, []);

  const navigateBack = () => {
    history.push(ROUTES.OPERATIONS, { direction: "back" });
  };

  const handleSave = () => {
    if (operationName.trim()) {
      createOperation(operationName.trim(), estimatedTime, estimatedTimeUnit, cookies.token)
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
    setOperationName(e.target.value);
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
      <Header title={t("new Operation")} onBackClick={handleBackClick} backButtonHref={ROUTES.OPERATIONS}></Header>
      <IonContent>
        <SingleInputPage
          title={t("new Operation")}
          backHref={ROUTES.OPERATIONS}
          label={t("operation Name")}
          value={operationName}
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
export default NewOperation;
