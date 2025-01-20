import { IonContent, IonPage, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useParams } from "react-router";
import { Table } from "../../../components/table/Table";
import { ORDER_ITEM_REQUEST } from "../../../dispatcher";
import { useState } from "react";
import { Preloader } from "../../../components/preloader/preloader";
import { TOAST_DELAY } from "../../../constants/toastDelay";

const OrderProducts = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderItems, setOrderItems] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  useIonViewWillEnter(() => {
    ORDER_ITEM_REQUEST.getOrderItems(parseInt(orderId, 10), setOrderItems, setLoading, setToastMessage);
  });

  const productNames = Array.from(new Set(orderItems.map(({ orderItem }) => orderItem.productName)));
  const rows = productNames.map((product, ind) => ({
    id: ind,
    values: [String(ind + 1), String(product)],
    navigateTo: "",
    navigationAllowed: false,
  }));

  return (
    <IonPage color="light">
      <Header title={t("text.products")} backButtonHref={ROUTES.ORDER(orderId)} />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <Table
            cols={[
              { label: t("orders.id"), size: 1 },
              { label: t("orders.name"), size: 4 },
            ]}
            label={""}
            rows={rows}
          />
        )}
      </IonContent>
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
    </IonPage>
  );
};

export default OrderProducts;
