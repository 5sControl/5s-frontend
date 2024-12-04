import { Html5QrcodeCameraScanConfig, Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import "./qrScanner.scss";
import { useIonViewWillLeave, useIonViewDidEnter } from "@ionic/react";

type Html5QrcodePluginProps = {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
  qrCodeErrorCallback?: (error: any) => void;
};

const qrcodeRegionId = "html5qr-code-full-region";

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = props => {
  const html5QrcodeScannerRef = useRef<Html5QrcodeScanner | null>(null);
  let hasScanned = false;
  let initialized = false;

  useEffect(() => {
    const config: Html5QrcodeCameraScanConfig = {
      fps: props.fps,
      qrbox: props.qrbox,
      aspectRatio: props.aspectRatio,
      disableFlip: props.disableFlip,
    };

    const verbose = props.verbose === true;
    const scanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
    html5QrcodeScannerRef.current = scanner;

    scanner.render(
      (decodedText, decodedResult) => {
        if (decodedResult && !hasScanned) {
          hasScanned = true;
          props.qrCodeSuccessCallback(decodedText, decodedResult);
        } else {
          console.warn("Unsupported format detected:", decodedResult);
        }
      },
      error => {
        if (verbose) {
          console.error("Error during scanning:", error);
        }
        props.qrCodeErrorCallback && props.qrCodeErrorCallback(error);
      }
    );

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  useIonViewWillLeave(() => {
    const scanner = html5QrcodeScannerRef.current;
    if (scanner && hasScanned) {
      scanner.pause();
      initialized = true;
    }
  });

  useIonViewDidEnter(() => {
    hasScanned = false;
    const scanner = html5QrcodeScannerRef?.current;
    if (scanner && initialized && !hasScanned) {
      scanner.resume();
    }
  });

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
