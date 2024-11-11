import { useHistory, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import Card from "../../../ui/card/Card";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonIcon, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { TrashBin } from "../../../assets/svg/SVGcomponent";
import { getOperation } from "../../../api/operations";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { IOperation } from "../../../models/interfaces/operation.interface";

const Operation = () => {
  const [cookies] = useCookies(["token"]);
  const { id }: { id: string } = useParams();
  const { t } = useTranslation();
  const [operation, setOperation] = useState<IOperation>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    getOperation(Number(id), cookies.token)
      .then(response => {
        setOperation(response.data);
      })
      .catch(error => console.error(error));
  });

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleOpenModal = () => {
    setShowConfirmationModal(true);
  };

  const deleteCard = async (id: number, token: string) => {
    //! delete operation
  };

  return (
    <IonPage>
      <Header title={operation?.name} backButtonHref={ROUTES.OPERATIONS} />
      <IonContent>
        {operation ? (
          <>
            <Card
              deleteCard={deleteCard}
              itemTitle={operation.name}
              backHref={ROUTES.OPERATIONS}
              editHref={ROUTES.OPERATION_EDIT(id)}
              showConfirmationModal={showConfirmationModal}
              handleCloseModal={handleCloseModal}
            />
            <InputReadonly
              label={t("directory.operations.estimatedTime")}
              value={`${operation.estimatedTime} ${operation.estimatedTimeUnit}`}
            />
          </>
        ) : (
          <div className="preloader">
            <Preloader />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Operation;
