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
import { getOperation, updateOperation } from "../../../api/operations";
import { TimeUnit } from "../../../models/types/timeUnit";

const EditDirectoryCard = () => {
  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [operationName, setOperationName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState<number>(30);
  const [estimatedTimeUnit, setEstimatedTimeUnit] = useState<TimeUnit>("minutes");
  const [initialValue, setInitialValue] = useState(operationName);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useIonViewWillEnter(() => {
    setInitialValue(operationName);
    setLoading(true);
    getOperation(Number(id), cookies.token)
      .then(response => {
        setOperationName(response.data.name);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const navigateBack = () => {
    history.push(ROUTES.OPERATION(id!), { direction: "back" });
  };

  const handleSave = () => {
    if (operationName.trim()) {
      updateOperation(Number(id), operationName.trim(), estimatedTime, estimatedTimeUnit, cookies.token)
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
      <Header title={t("edit Operation")} onBackClick={handleBackClick} backButtonHref={ROUTES.OPERATION(id)}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <SingleInputPage
            backHref={ROUTES.OPERATION(id)}
            label={t("operation name")}
            value={operationName}
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
