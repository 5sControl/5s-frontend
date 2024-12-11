import { useIonViewWillLeave } from "@ionic/react";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import "./qrScanner.scss";
import { useTranslation } from "react-i18next";

type QrCodeProps = {
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
};

const QrCode = ({ qrCodeSuccessCallback }: QrCodeProps) => {
  const { t } = useTranslation();
  const qrCodeReaderRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    qrCodeReaderRef.current = scanner;
  }, []);

  useIonViewWillLeave(() => {
    const scanner = qrCodeReaderRef?.current;
    if (scanner) {
      stopScanning();
    }
  });

  const startScanning = () => {
    setScanning(true);
    setError(null);
    const scanner = qrCodeReaderRef?.current;
    scanner?.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250,
      },
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
      scanner
        .stop()
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
      <button className="qr__button" onClick={scanning ? stopScanning : startScanning}>
        {scanning ? t("scanner.stop") : t("scanner.start")}
      </button>
    </div>
  );
};
export default QrCode;
