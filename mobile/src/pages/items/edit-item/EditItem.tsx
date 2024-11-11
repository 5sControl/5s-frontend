import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { getOperation, updateOperation } from "../../../api/operations";
import { TimeUnit } from "../../../models/types/timeUnit";
import { getItem, updateItem } from "../../../api/items";

const EditItem = () => {
  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [itemName, setItemName] = useState("");
  const [initialValue, setInitialValue] = useState(itemName);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useIonViewWillEnter(() => {
    setInitialValue(itemName);
    setLoading(true);
    getItem(Number(id), cookies.token)
      .then(response => {
        setItemName(response.data.name);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const navigateBack = () => {
    history.push(ROUTES.ITEM(id), { direction: "back" });
  };

  const handleSave = () => {
    if (itemName.trim()) {
      updateItem(Number(id), itemName.trim(), cookies.token)
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
      <Header title={t("edit Item")} onBackClick={handleBackClick} backButtonHref={ROUTES.ITEM(id)}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <SingleInputPage
            backHref={ROUTES.ITEM(id)}
            label={t("operation name")}
            value={itemName}
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
export default EditItem;
