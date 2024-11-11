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
import { getItem } from "../../../api/items";
import { IItem } from "../../../models/interfaces/item.interface";

const Item = () => {
  const [cookies] = useCookies(["token"]);
  const { id }: { id: string } = useParams();
  const { t } = useTranslation();
  const [item, setItem] = useState<IItem>();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    getItem(Number(id), cookies.token)
      .then(response => {
        setItem(response.data);
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
    //! delete item
  };

  return (
    <IonPage>
      <Header title={item?.name} backButtonHref={ROUTES.ITEMS} />
      <IonContent>
        {item ? (
          <Card
            deleteCard={deleteCard}
            itemTitle={item.name}
            backHref={ROUTES.ITEMS}
            editHref={ROUTES.ITEM_EDIT(id)}
            showConfirmationModal={showConfirmationModal}
            handleCloseModal={handleCloseModal}
          />
        ) : (
          <div className="preloader">
            <Preloader />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Item;
