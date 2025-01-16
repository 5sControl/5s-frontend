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

const EditDirectoryCard = () => {
  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [operationName, setOperationName] = useState("");
  const [estimatedTime, setEstimatedTime] = useState();
  const [timeUnit, setTimeUnit] = useState<TimeUnit>();
  const [initialOperationName, setInitialOperationName] = useState("");
  // const [initialEstimatedTime, setInitialEstimatedTime] = useState(estimatedTime);
  // const [initialTimeUnit, setInitialTimeUnit] = useState(timeUnit);
  const [isOpenModal, setIsOpenModal] = useState(false);
  // const [estimatedTimeIsChanged, setEstimatedTimeIsChanged] = useState(false);
  // const [timeUnitIsChanged, setTimeUnitIsChanged] = useState(false);

  // const selectItems: SelectItem[] = [
  //   {
  //     id: "minutes",
  //     label: t("timeUnit.minutes"),
  //     value: "minutes",
  //   },
  //   {
  //     id: "hours",
  //     label: t("timeUnit.hours"),
  //     value: "hours",
  //   },
  // ];

  useIonViewWillEnter(() => {
    setInitialOperationName(operationName);
    // setInitialEstimatedTime(estimatedTime);
    // setInitialTimeUnit(timeUnit);
    setLoading(true);
    getOperation(Number(id), cookies.token)
      .then(response => {
        setOperationName(response.data.name);
        setInitialOperationName(response.data.name);
        // setTimeUnit(response.data.estimatedTimeUnit);
        // setEstimatedTime(response.data.estimatedTime);
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
      updateOperation(Number(id), operationName.trim(), estimatedTime!, timeUnit!, cookies.token)
        .then(() => navigateBack())
        .catch(error => {
          console.error(error);
        });
      return;
    }
  };

  const handleBackClick = () => {
    if (operationName !== initialOperationName) {
      setIsOpenModal(true);
    } else {
      navigateBack();
    }
  };

  const handleChangeOperationName = e => {
    setOperationName(e.target.value);
  };

  // const handleChangeEstimatedTime = e => {
  //   setEstimatedTime(e.target.value);
  //   if (e.target.value.trim() !== String(initialEstimatedTime).trim()) {
  //     setEstimatedTimeIsChanged(true);
  //   }
  // };

  // const handleChangeTimeUnit = e => {
  //   setTimeUnit(e.target.value);
  //   if (e.target.value !== initialTimeUnit) {
  //     setTimeUnitIsChanged(true);
  //   }
  // };

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
              disabled={!operationName.trim() || operationName === initialOperationName}
            />
            {/* <Select
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
            /> */}
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
