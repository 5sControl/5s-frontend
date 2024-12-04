import { useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import "./qrScanner.scss";
import { useHistory } from "react-router";
import { ROUTES } from "../../shared/constants/routes";

type QrCodeProps = {
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
};

const QrCode = ({ qrCodeSuccessCallback }: QrCodeProps) => {
  const qrCodeReaderRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // let hasScanned = false;
  // let initialized = false;

  useEffect(() => {
    // hasScanned = false;
    const scanner = new Html5Qrcode("qr-reader");
    qrCodeReaderRef.current = scanner;
  }, []);

  useIonViewWillLeave(() => {
    const scanner = qrCodeReaderRef?.current;
    // if (scanner && hasScanned) {
    //   scanner.pause();
    //   initialized = true;
    // }
    if (scanner) {
      stopScanning();
    }
  });

  useIonViewDidEnter(() => {
    // hasScanned = false;
    const scanner = qrCodeReaderRef?.current;
    // if (scanner && initialized && !hasScanned) {
    //   scanner.resume();
    // }
    // stopScanning();
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
            // hasScanned = true;
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
          // hasScanned = false;
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
        {scanning ? "Stop Scanning" : "Start Scanning"}
      </button>
    </div>
  );
};
export default QrCode;
