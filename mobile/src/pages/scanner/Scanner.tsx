import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonToast } from "@ionic/react";
import { Header } from "../../components/header/Header";
import Html5QrcodePlugin from "../../components/qrScanner/qrScanner";
import { createOrderFromQr } from "../../api/scanner";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { ROUTES } from "../../shared/constants/routes";
import { TOAST_DELAY } from "../../constants/toastDelay";

const Scanner = () => {
    const [cookies] = useCookies(["token"]);
    const [qrInfo, setQrInfo] = useState('');
    const history = useHistory();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const tempOperationId = 10;

    const redirectToOrder = (orderId: string, orderItemId: string, operationId: string) => {
        history.push(ROUTES.ORDER_TIMESPAN(orderId, orderItemId, operationId));
    };

    let debounceTimeout;

    const onNewScanResult = (decodedText, decodedResult) => {
        if (debounceTimeout) return; 
    
        if (!isProcessing && !hasScanned) {
            console.log('decodedText', decodedText);
            setIsProcessing(true);
            setQrInfo(decodedText);
            setHasScanned(true);

            debounceTimeout = setTimeout(() => {
                setIsProcessing(false);
                setHasScanned(false);
                debounceTimeout = null;
            }, 2000);
    
            createOrderFromQr({ qrCode: decodedText, operationId: tempOperationId }, cookies.token)
                .then(response => {
                    const data = response.data;
                    const operationId = data.id;
                    const orderItemId = data.orderItem.id;
                    const orderId = data.orderItem.order.id;
                    redirectToOrder(orderId.toString(), orderItemId.toString(), operationId.toString());
                })
                .catch(error => {
                    setToastMessage("Incorrect QR. Please try again.");
                })
                .finally(() => {
                    console.log('finally');

                });
        }
    };

    return (
        <IonPage>
            <Header title="QR Scanner" backButtonHref={ROUTES.MENU} />
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