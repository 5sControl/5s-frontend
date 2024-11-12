import React, { useState } from "react";
import { IonPage, IonContent, IonToast } from "@ionic/react";
import { Header } from "../../components/header/Header";
import Html5QrcodePlugin from "../../components/qrScanner/qrScanner";
import { createOrderFromQr } from "../../api/scanner";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router";
import { ROUTES } from "../../shared/constants/routes";
import { TOAST_DELAY } from "../../constants/toastDelay";

const Scanner = () => {
    const [cookies] = useCookies(["token"]);
    const [qrInfo, setQrInfo] = React.useState('');
    const history = useHistory();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    let isProcessing: boolean = false;

    const redirectToOrder = (orderId: string, orderItemId: string, operationId: string) => {
        history.push(ROUTES.ORDER_TIMESPAN(orderId, orderItemId, operationId));
    };
    const onNewScanResult = (decodedText, decodedResult) => {
        if (!isProcessing){
            isProcessing = true; 
            setQrInfo(decodedText);
            createOrderFromQr({ qrCode: decodedText, operationId: 3 }, cookies.token)
                .then(response => {
                    const data = response.data;
                    const operationId = data.id;
                    const orderItemId = data.orderItem.id;
                    const orderId = data.orderItem.order.id;
                    redirectToOrder(orderId.toString(), orderItemId.toString(), operationId.toString());
                })
                .catch(error => {
                    setToastMessage("Incorrect QR. Please try again.");
                });
        }
    };

    return (
        <IonPage>
          <Header title="Qr Scanner" backButtonHref={ROUTES.SCANNER_CONFIGURATION}/>
          <IonContent className="ion-padding">
          <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            />
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