import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { createDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { IonContent, IonPage, IonToast, useIonViewWillEnter, useIonViewWillLeave } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { createOperation } from "../../../api/operations";
import { TimeUnit } from "../../../models/types/timeUnit";
import Select from "../../../components/selects/select/Select";
import { Input } from "../../../components/inputs/input/Input";
import { SelectItem } from "../../../models/types/selectItem";

const NewOperation = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
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
      id: "minutes",
      label: t("timeUnit.minutes"),
      value: "minutes",
    },
    {
      id: "hours",
      label: t("timeUnit.hours"),
      value: "hours",
    },
  ];

  useEffect(() => {
    setInitialOperationName(operationName);
    setInitialEstimatedTime(estimatedTime);
    setInitialTimeUnit(timeUnit);
  }, []);

  // useIonViewWillEnter(() => {
  //   setInitialOperationName(operationName);
  //   setInitialEstimatedTime(estimatedTime);
  //   setInitialTimeUnit(timeUnit);
  // });

  const navigateBack = () => {
    history.push(ROUTES.OPERATIONS, { direction: "back" });
  };

  const handleSave = () => {
    if (operationName.trim()) {
      createOperation(operationName.trim(), estimatedTime, timeUnit, cookies.token)
        .then(() => navigateBack())
        .catch(error => console.error(error));
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

  const handleChangeInput = e => {
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
      <Header
        title={t("directory.operations.newOperation")}
        onBackClick={handleBackClick}
        backButtonHref={ROUTES.OPERATIONS}
      ></Header>
      <IonContent>
        <SingleInputPage
          title={t("directory.operations.newOperation")}
          backHref={ROUTES.OPERATIONS}
          label={t("directory.name")}
          value={operationName}
          required
          handleChange={handleChangeInput}
          handleSave={handleSave}
          disabled={!operationName.trim() || !String(estimatedTime).trim() || !timeUnit || estimatedTime! <= 0}
        />
        <Select
          value={timeUnit!}
          label={t("timeUnit.title")}
          placeholder={t("timeUnit.selectTimeUnit")}
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
