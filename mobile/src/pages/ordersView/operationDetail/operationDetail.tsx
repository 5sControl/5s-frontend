import { Header } from "../../../components/header/Header"
import { ROUTES } from "../../../shared/constants/routes"
import { OperationDetailItem } from "../../../models/interfaces/operatoinDetailItem.interface"
import { IonContent } from "@ionic/react"
import { useParams } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useEffect, useState } from "react"
import { getOrderViewOperation } from "../../../api/ordersView"
import moment from "moment"
import { GreenStatus, GreyStatus } from "../../../assets/svg/SVGcomponent"
import './operationDetail.scss'
import { Preloader } from "../../../components/preloader/preloader"
import '../../../styles/common.scss'

export const OperationDetail = () => {
    const [cookies] = useCookies(["token"]);
    const { id } = useParams() as { id: string };
    const [detail, setDetail] = useState<OperationDetailItem>({} as OperationDetailItem);
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(true);

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
        })
        .finally(() => {
          setLoading(false);
        });
    }, [])

    return (
        <IonContent>
            <Header title='' backButtonHref={ROUTES.ORDERSVIEW}/>
            { 
            loading 
            ? <div className="preloader">
                <Preloader />
              </div> 
            : <div className="ion-padding">
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
            }
        </IonContent>
    )
}