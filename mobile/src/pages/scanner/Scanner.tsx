import React from "react";
import { IonPage, IonContent, IonText, IonLabel, IonListHeader } from "@ionic/react";
import { Header } from "../../components/header/Header";
import Html5QrcodePlugin from "../../components/qrScanner/qrScanner";
import { createOrderFromQr } from "../../api/scanner";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router";
import { ROUTES } from "../../shared/constants/routes";

const Scanner = () => {
    const [cookies] = useCookies(["token"]);
    const [qrInfo, setQrInfo] = React.useState('');
    const history = useHistory();

    const redirectToOrder = (orderId: string, orderItemId: string, operationId: string) => {
        history.push(ROUTES.ORDER_TIMESPAN(orderId, orderItemId, operationId));
    };

    const onNewScanResult = (decodedText: string, decodedResult: any) => {
        setQrInfo(decodedText);
        createOrderFromQr({ qrCode: decodedText, operationId: 3 }, cookies.token).then(response => {
            const data = response.data;
            const operationId = data.id;
            const orderItemId = data.orderItem.id;
            const orderId = data.orderItem.order.id;
            redirectToOrder(orderId.toString(), orderItemId.toString(), operationId.toString());
        })
    };

    return (
        <IonPage>
          <Header title="Qr Scanner" />
          <IonContent className="ion-padding">
          <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
            />
            {/* {qrInfo && 
            <>
                <IonListHeader>
                    Info from QR:
                </IonListHeader>
                <IonText>
                    {qrInfo}
                </IonText>
            </>
            } */}
          </IonContent>
        </IonPage>
      );
};

export default Scanner;