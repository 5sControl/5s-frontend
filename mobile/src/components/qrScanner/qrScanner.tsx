import { Html5QrcodeCameraScanConfig, Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

type Html5QrcodePluginProps = {
    fps?: number;
    qrbox?: number;
    aspectRatio?: number;
    disableFlip?: boolean;
    verbose?: boolean;
    qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void;
    qrCodeErrorCallback?: (error: any) => void;
}

const qrcodeRegionId = "html5qr-code-full-region";
const createConfig = (props: Html5QrcodePluginProps) => {
    let config: Html5QrcodeCameraScanConfig = {
        fps: undefined
    };
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (props) => {

    useEffect(() => {
        const config = createConfig(props);
        const verbose = props.verbose === true;
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default Html5QrcodePlugin;