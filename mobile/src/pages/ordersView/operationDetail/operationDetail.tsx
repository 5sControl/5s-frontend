import { Header } from "../../../components/header/Header"
import { ROUTES } from "../../../shared/constants/routes"
import { OperationDetailItem } from "../../../models/interfaces/operatoinDetailItem.interface"
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonToolbar, useIonViewWillEnter } from "@ionic/react"
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
import "../../../styles/common.scss"
import { Download } from "../../../assets/svg/SVGcomponent"
import { downloadFile } from "../../../utils/downloadFile"

export const OperationDetail = () => {
    const [cookies] = useCookies(["token"]);
    const { id } = useParams() as { id: string };
    const [detail, setDetail] = useState<OrderDetail>({} as OrderDetail);
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(true);
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);
    const history = useHistory();

    useIonViewWillEnter(() => {
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
    })

    const handleDownload = (index = 0) => {
        if (detail && detail.videos[index] && detail.videos[index].status) {
          const videoUrl = `${import.meta.env.VITE_API_BASE_URL}${detail?.videos[index].file_name}`;
    
          downloadFile(videoUrl, detail.videos[index].file_name);
        }
      };

    const handlePlay = (index = 0) => {
        if (detail) {
            if (!isReady) {
                const timeToStart = (detail?.videos[index].video_start_from || 0) / 1000;
                playerRef.current.seekTo(timeToStart, 'seconds');
                setIsReady(true);
              }
        }
    };

    const backHandler = () => {
        history.push(ROUTES.ORDERSVIEW, { direction: "back" });
    };

    return (
        <IonPage color="light">
            <IonHeader style={{position: 'absolute'}}>
                    <IonToolbar className="transparent">
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
                        <div className="titleWrapper">
                            <h4 className="title">{detail.oprName}</h4>
                            <img src={Download} alt="download" onClick={() => handleDownload(0)}/>
                        </div>
                        
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
                            url={`${import.meta.env.VITE_API_BASE_URL}${detail?.videos[0].file_name}`}
                            onReady={() => handlePlay(0)}
                        />  
                </div>    
            }
        </IonContent>
        </IonPage>
    )
}