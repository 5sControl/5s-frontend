import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonItem, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { getOperation, updateOperation } from "../../../api/operations";
import { TimeUnit } from "../../../models/types/timeUnit";
import Select from "../../../components/select/Select";
import { SelectItem } from "../../../models/types/selectItem";
import { Input } from "../../../components/inputs/input/Input";

const EditDirectoryCard = () => {
  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [operationName, setOperationName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState();
  const [timeUnit, setTimeUnit] = useState<TimeUnit>();
  const [initialOperationName, setInitialOperationName] = useState(operationName);
  const [initialEstimatedTime, setInitialEstimatedTime] = useState(estimatedTime);
  const [initialTimeUnit, setInitialTimeUnit] = useState(timeUnit);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [operationNameIsChanged, setOperationNameIsChanged] = useState(false);
  const [estimatedTimeIsChanged, setEstimatedTimeIsChanged] = useState(false);
  const [timeUnitIsChanged, setTimeUnitIsChanged] = useState(false);

  const selectItems: SelectItem[] = [
    {
      label: t("timeUnit.minutes"),
      value: "minutes",
    },
    {
      label: t("timeUnit.hours"),
      value: "hours",
    },
  ];

  useIonViewWillEnter(() => {
    setInitialOperationName(operationName);
    setInitialEstimatedTime(estimatedTime);
    setInitialTimeUnit(timeUnit);
    setLoading(true);
    getOperation(Number(id), cookies.token)
      .then(response => {
        setOperationName(response.data.name);
        setTimeUnit(response.data.estimatedTimeUnit);
        setEstimatedTime(response.data.estimatedTime);
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
    if (operationName.trim() && String(estimatedTime).trim()) {
      updateOperation(Number(id), operationName.trim(), estimatedTime!, timeUnit!, cookies.token)
        .then(() => navigateBack())
        .catch(error => {
          console.error(error);
        });
      return;
    }
    console.error("empty input");
  };

  const handleBackClick = () => {
    if (operationNameIsChanged || estimatedTimeIsChanged || timeUnitIsChanged) {
      setIsOpenModal(true);
    } else {
      navigateBack();
    }
  };

  const handleChangeOperationName = e => {
    setOperationName(e.target.value);
    if (e.target.value.trim() !== initialOperationName.trim()) {
      setOperationNameIsChanged(true);
    }
  };

  const handleChangeEstimatedTime = e => {
    setEstimatedTime(e.target.value);
    if (e.target.value.trim() !== String(initialEstimatedTime).trim()) {
      setEstimatedTimeIsChanged(true);
    }
  };

  const handleChangeTimeUnit = e => {
    setTimeUnit(e.target.value);
    if (e.target.value !== initialTimeUnit) {
      setTimeUnitIsChanged(true);
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
      <Header title={t("directory.edit")} onBackClick={handleBackClick} backButtonHref={ROUTES.OPERATION(id)}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <SingleInputPage
              backHref={ROUTES.OPERATION(id)}
              label={t("directory.name")}
              value={operationName}
              required
              handleChange={handleChangeOperationName}
              handleSave={handleSave}
              disabled={!operationName.trim() || !String(estimatedTime).trim() || estimatedTime! <= 0}
            />
            <Select
              value={timeUnit!}
              label={t("timeUnit.title")}
              placeholder="Select Time Unit"
              selectList={selectItems}
              handleChange={handleChangeTimeUnit}
            />
            <Input
              label={t("directory.operations.estimatedTime")}
              type="number"
              value={estimatedTime!}
              required
              handleChange={handleChangeEstimatedTime}
            />
          </>
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
