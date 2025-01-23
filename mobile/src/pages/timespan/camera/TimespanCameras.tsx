import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory, useParams } from "react-router";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import { useState } from "react";
import { Preloader } from "../../../components/preloader/preloader";
import { useCookies } from "react-cookie";
import { getOrderViewOperation } from "../../../api/ordersView";
import { OrderDetail, VideoDataStatus } from "../../../models/interfaces/ordersView.interface";
import styles from "./timespan.module.scss";
import { API_BASE_URL } from "../../../config";

const TimespanCameras = () => {
  const { orderId, itemId, operationId, timespanId } = useParams<{
    orderId: string;
    itemId: string;
    operationId: string;
    timespanId: string;
  }>();
  const [cookies] = useCookies(["token"]);
  // const [detail, setDetail] = useState<OrderDetail>({} as OrderDetail);
  const [videos, setVideos] = useState<VideoDataStatus[]>();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();

  const handleItemClick = (path: string) => history.push(path);

  useIonViewWillEnter(() => {
    setLoading(true);
    getOrderViewOperation(cookies.token, parseInt(timespanId))
      .then(response => {
        console.log(response.data);
        const operation = response.data;
        // setDetail(response.data);
        setVideos(response.data.videos);
      })
      .catch(err => {
        console.log(err);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const getCameraDate = fileName => {
    const parts = fileName.split("/");
    const fileData = parts[parts.length - 1];
    const datePart = fileData.split("_")[0];

    return datePart.split("-").reverse().join(".");
  };

  const filteredVideos = videos?.filter(video => video.status) || [];

  const cameraBlock = (video: VideoDataStatus) => (
    <div className={styles.camera}>
      <img
        className={styles.camera__image}
        src={`${API_BASE_URL}images/${video.camera_ip}/snapshot.jpg`}
        alt="Camera"
      />
      <div className={styles.camera__info}>
        <h2>{video.camera_ip}</h2>
        <p className={styles.camera__info_date}>{getCameraDate(video.file_name)}</p>
      </div>
    </div>
  );

  return (
    <IonPage>
      <Header
        title={t("camera.plural")}
        backButtonHref={ROUTES.ORDER_TIMESPAN_EDIT(orderId, itemId, operationId, timespanId)}
      />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            {filteredVideos.length === 0 ? (
              <IonList inset>
                <IonItem>{t("messages.noCameras")}</IonItem>
              </IonList>
            ) : (
              filteredVideos.map(video => (
                <IonList inset key={video.file_name}>
                  <MenuListButton
                    title={cameraBlock(video)}
                    handleItemClick={() =>
                      handleItemClick(
                        ROUTES.ORDER_TIMESPAN_CAMERA(orderId, itemId, operationId, timespanId, video.camera_ip!)
                      )
                    }
                  />
                </IonList>
              ))
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default TimespanCameras;
