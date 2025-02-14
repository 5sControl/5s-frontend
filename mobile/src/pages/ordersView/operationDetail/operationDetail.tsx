import { ROUTES } from "../../../shared/constants/routes";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { getOrderViewOperation } from "../../../api/ordersView";
import moment from "moment";
import { GreenStatus, GreyStatus, Download } from "../../../assets/svg/SVGcomponent";
import "./operationDetail.scss";
import { Preloader } from "../../../components/preloader/preloader";
import "../../../styles/common.scss";
import { OrderDetail } from "../../../models/interfaces/ordersView.interface";
import { arrowBack } from "ionicons/icons";
import { downloadFile } from "../../../utils/downloadFile";
import { API_BASE_URL } from "../../../config";
import HlsVideoPlayer from "../../../components/hlsVideoPlayer/HlsVideoPlayer";

export const OperationDetail = () => {
  const [cookies] = useCookies(["token"]);
  const { timespanId, cameraId } = useParams<{
    orderId: string;
    itemId: string;
    operationId: string;
    timespanId: string;
    cameraId: string;
  }>();
  const [detail, setDetail] = useState<OrderDetail>({} as OrderDetail);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [videoIndex, setVideoIndex] = useState<number>(0);
  const history = useHistory();
  const [noVideo, setNoVideo] = useState(false);
  //   const videoIndex = cameraId ? detail.videos.findIndex(video => video.camera_ip === cameraId) : 0;

  useIonViewWillEnter(() => {
    getOrderViewOperation(cookies.token, parseInt(timespanId))
      .then(response => {
        const operation = response.data;
        if (operation.videos.length === 0) {
          setNoVideo(true);
        }
        setDetail(response.data);
        if (cameraId) {
          setVideoIndex(response.data.videos.findIndex(video => video.camera_ip === cameraId));
        }
      })
      .catch(err => {
        setNoVideo(true)
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const handleDownload = (index = 0) => {
    if (detail && detail.videos[index] && detail.videos[index].status) {
      const videoUrl = `${API_BASE_URL}${detail?.videos[index].file_name}`;

      downloadFile(videoUrl, detail.videos[index].file_name);
    }
  };

  const backHandler = () => {
    history.go(-1);
    // if (orderId && itemId && operationId) {
    //   history.push(ROUTES.ORDER_TIMESPAN_CAMERAS(orderId, itemId, operationId, timespanId), { direction: "back" });
    //   return;
    // }
    // history.push(ROUTES.ORDERSVIEW, { direction: "back" });
  };

  const onVideoLoad = (video: HTMLVideoElement) => {
    if (video.duration) {
      setDuration(moment.utc(video.duration * 1000).format("HH:mm:ss"));
    }
  }

  return (
    <IonPage color="light">
      <IonHeader style={{ position: "absolute" }}>
        <IonToolbar className="transparent">
          <IonButtons slot="start" className="header__start">
            <IonButton onClick={backHandler}>
              <IonIcon style={{ fontSize: "18px" }} icon={arrowBack} color="light" mode="ios" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <div className="videoWrapper">
            {
              noVideo ?
              <IonTitle color={"light"}>No video available</IonTitle>
              :
              <>
              <div className="orderDetail ion-padding">
                <div className="titleWrapper">
                  <h4 className="title">{detail.oprName}</h4>
                  <img src={Download} alt="download" onClick={() => handleDownload(videoIndex)} />
                </div>

                <div className="subtitle">
                  <span>Time: </span>
                  <span className="subtitle_value">{moment(detail.sTime).format("HH:mm:ss")} </span>
                  <span>{duration && `(${duration})`}</span>
                </div>
                <div className="subtitle">
                  <span>Order: </span>
                  <span className="subtitle_value">{detail.orId}</span>
                </div>
                <div className="status">
                  <img src={detail.status === null ? GreyStatus : GreenStatus} />
                </div>
              </div>
              <HlsVideoPlayer
                onLoad={onVideoLoad}
                base64Playlist={detail?.videos[videoIndex]?.playlist}
              />
              </>
          }
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
