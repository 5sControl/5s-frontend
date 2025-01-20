import { useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import "./qrScanner.scss";
import { useTranslation } from "react-i18next";

type QrCodeProps = {
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
};

const QR_ELEMENT_ID = "qr-reader";
const cameraIdOrConfig = { facingMode: "environment" };
const Html5QrcodeCameraScanConfig = {
  fps: 10,
  qrbox: 250,
};

const QrCode = ({ qrCodeSuccessCallback }: QrCodeProps) => {
  const { t } = useTranslation();
  const qrCodeReaderRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(QR_ELEMENT_ID);
    qrCodeReaderRef.current = scanner;
    startScanning();

    return () => {
      stopScanning(); 
    };
  }, []);

  useIonViewDidEnter(() => {
    startScanning();
  })

  useIonViewWillLeave(() => {
    stopScanning();
  });


  const startScanning = () => {
    setScanning(true);
    setError(null);
    const scanner = qrCodeReaderRef?.current;
    scanner?.start(
      cameraIdOrConfig,
      Html5QrcodeCameraScanConfig,
      (decodedText, decodedResult) => {
        if (qrCode !== decodedText) {
          if (decodedResult) {
            qrCodeSuccessCallback(decodedText, decodedResult);
          } else {
            console.warn("Unsupported format detected:", decodedResult);
          }
        }
      },
      errorMessage => {
        setError(errorMessage);
      }
    );
  };

  const stopScanning = () => {
    const scanner = qrCodeReaderRef?.current;
    
    if (scanner?.isScanning) {
      scanner?.stop()
        .then(() => {
          setScanning(false);
          setQrCode(null);
        })
        .catch(err => {
          console.error("Failed to stop scanning:", err);
        }); 
    }
  };

  return (
    <div className="qr__container">
      <div id="qr-reader"></div>
    </div>
  );
};
export default QrCode;