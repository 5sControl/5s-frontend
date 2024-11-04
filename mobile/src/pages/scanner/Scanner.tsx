import React from "react";
import { IonPage, IonContent, IonText, IonLabel, IonListHeader } from "@ionic/react";
import { Header } from "../../components/header/Header";
import Html5QrcodePlugin from "../../components/qrScanner/qrScanner";

const Scanner = () => {
    const [qrInfo, setQrInfo] = React.useState('');

    const onNewScanResult = (decodedText: string, decodedResult: any) => {
        setQrInfo(decodedText);
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