import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonToast } from "@ionic/react";
import { Header } from "../../components/header/Header";
import Html5QrcodePlugin from "../../components/qrScanner/qrScanner";
import { createOrderFromQr } from "../../api/scanner";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { ROUTES } from "../../shared/constants/routes";
import { TOAST_DELAY } from "../../constants/toastDelay";
import { setTimespan } from "../../store/timespanSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import QrCode from "../../components/qrScanner/qrCustomScanner";

const Scanner = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["token"]);
  const [qrInfo, setQrInfo] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const redirectToOrder = (orderId: string, orderItemId: string, operationId: string) => {
    history.push(ROUTES.ORDER_TIMESPAN(orderId, orderItemId, operationId));
  };

  let debounceTimeout;

  const onNewScanResult = (decodedText, decodedResult) => {
    if (debounceTimeout) return;

    if (!isProcessing && !hasScanned) {
      setIsProcessing(true);
      setQrInfo(decodedText);
      setHasScanned(true);

      debounceTimeout = setTimeout(() => {
        setIsProcessing(false);
        setHasScanned(false);
        debounceTimeout = null;
      }, 2000);

      createOrderFromQr({ qrCode: decodedText }, cookies.token)
        .then(response => {
          const data = response.data;
          const operationId = data.id;
          const orderItemId = data.orderItem.id;
          const orderId = data.orderItem.order.id;
          const orderName = `${data.orderItem.order.orderNumber} ${
            data.orderItem.order.name ? data.orderItem.order.name : ""
          }`;
          const timespanData = {
            orderName: orderName,
            orderYear: data.orderItem.order.orderYear,
            orderItem: data.orderItem.name,
            orderOperation: decodedText.split('\\')[4]
          };
          dispatch(setTimespan(timespanData));
          redirectToOrder(orderId.toString(), orderItemId.toString(), operationId.toString());
        })
        .catch(error => {
          setToastMessage("Incorrect QR. Please try again.");
        });
    }
  };

  return (
    <IonPage>
      <Header title={t("menu.scanner")} backButtonHref={ROUTES.MENU} />
      <IonContent className="ion-padding">
        {/* <Html5QrcodePlugin fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult} /> */}
        <QrCode qrCodeSuccessCallback={onNewScanResult} />
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage || undefined}
          duration={TOAST_DELAY}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Scanner;
