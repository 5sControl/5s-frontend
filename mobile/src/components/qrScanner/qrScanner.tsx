import { Html5QrcodeCameraScanConfig, Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import './qrScanner.scss';

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

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (props) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {

        console.log(isMounted)
        if (!isMounted) {
            const config: Html5QrcodeCameraScanConfig = {
                fps: props.fps,
                qrbox: props.qrbox,
                aspectRatio: props.aspectRatio,
                disableFlip: props.disableFlip,
            };

            const verbose = props.verbose === true;

            if (!props.qrCodeSuccessCallback) {
                throw new Error("qrCodeSuccessCallback is a required callback.");
            }

            const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
            html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

            setIsMounted(true);

            return () => {
                console.log('return');
                html5QrcodeScanner.pause();
                html5QrcodeScanner.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            };
        }
    }, []);

    return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;