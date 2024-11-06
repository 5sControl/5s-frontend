import React from "react";
import { IonPage, IonContent, IonText, IonLabel, IonListHeader } from "@ionic/react";
import { Header } from "../../components/header/Header";
import Html5QrcodePlugin from "../../components/qrScanner/qrScanner";
import { createOrderFromQr } from "../../api/scanner";
import { useCookies } from "react-cookie";

const Scanner = () => {
    const [cookies] = useCookies(["token"]);
    const [qrInfo, setQrInfo] = React.useState('');

    const onNewScanResult = (decodedText: string, decodedResult: any) => {
        setQrInfo(decodedText);
        createOrderFromQr({ qrCode: decodedText, operationId: 3 }, cookies.token);
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
            {qrInfo && 
            <>
                <IonListHeader>
                    Info from QR:
                </IonListHeader>
                <IonText>
                    {qrInfo}
                </IonText>
            </>
            }
          </IonContent>
        </IonPage>
      );
};

export default Scanner;