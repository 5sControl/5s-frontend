import { Header } from "../../../components/header/Header"
import { ROUTES } from "../../../shared/constants/routes"
import { OperationDetailItem } from "../../../models/interfaces/operatoinDetailItem.interface"
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonToolbar } from "@ionic/react"
import { useHistory, useParams } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useCallback, useEffect, useRef, useState } from "react"
import { getOrderViewOperation } from "../../../api/ordersView"
import moment from "moment"
import { Back, GreenStatus, GreyStatus } from "../../../assets/svg/SVGcomponent"
import './operationDetail.scss'
import { Preloader } from "../../../components/preloader/preloader"
import '../../../styles/common.scss'
import ReactPlayer from 'react-player';
import { OrderDetail } from "../../../models/interfaces/ordersView.interface"
import { arrowBack } from "ionicons/icons"

export const OperationDetail = () => {
    const [cookies] = useCookies(["token"]);
    const { id } = useParams() as { id: string };
    const [detail, setDetail] = useState<OrderDetail>({} as OrderDetail);
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(true);
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getOrderViewOperation(cookies.token, parseInt(id))
        .then((response) => {
          const operation = response.data;
          setDetail(response.data);
          const startTime = moment(operation.sTime);
          const endTime = moment(operation.eTime);
          const duration = moment.duration(endTime.diff(startTime));
          const formattedDuration = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
          setDuration(formattedDuration);
        })
        .catch((err) => {
            console.log(err);
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [])

    const handlePlay = useCallback(() => {
        if (!isReady) {
          const timeToStart = (detail?.video.video_start_from || 0) / 1000;
          playerRef.current.seekTo(timeToStart, 'seconds');
          setIsReady(true);
        }
    }, [isReady]);

    const backHandler = () => {
        history.push(ROUTES.ORDERSVIEW, { direction: "back" });
    };

    return (
        <IonPage color="light">
            <IonHeader>
                    <IonToolbar color="dark">
                        <IonButtons slot="start" className="header__start">
                            <IonButton onClick={backHandler}>
                            <IonIcon style={{ fontSize: "18px" }} icon={arrowBack} color="light" mode="ios" />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar> 
                </IonHeader>
            <IonContent>
                { 
                loading 
                ? <div className="preloader">
                    <Preloader />
                </div> 
                : <div className="videoWrapper">
                    <div className="orderDetail ion-padding">
                        <h5 className="title">{detail.oprName}</h5>
                        <div className="subtitle">
                            <span>Time: </span>
                            <span className="subtitle_value">{moment(detail.sTime).format('HH:mm:ss')} </span>
                            <span>({duration})</span>
                        </div>
                        <div className="subtitle">
                            <span>Order: </span>
                            <span className="subtitle_value">{detail.orId}</span>
                        </div>
                        <div className="status">
                            <img src={detail.status === null ? GreyStatus : GreenStatus} />
                        </div>
                    </div>
                        <ReactPlayer
                            ref={playerRef}
                            width="100%"
                            height="100%"
                            playing={true}
                            volume={0.9}
                            controls={true}
                            preload="auto"
                            config={{
                                file: {
                                forceVideo: true,
                                },
                            }}
                            url={`${import.meta.env.VITE_API_BASE_URL}${detail?.video.file_name}`}
                            onReady={handlePlay}
                        />  
                </div>    
            }
        </IonContent>
        </IonPage>
    )
}