import { IonContent, IonDatetime, IonList, IonSegment, IonSegmentButton, SegmentChangeEventDetail, IonIcon, IonItem, IonLabel, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useState, useEffect, useMemo, SetStateAction } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { TIMESPAN_STATES } from "../../../models/enums/timespansStates.enum";
import { TIMESPAN_REQUEST } from "../../../dispatcher";
import { ITimespan } from "../../../models/interfaces/orders.interface";
import { Calendar, ArrowRight, Clock } from "../../../assets/svg/SVGcomponent";
import { formatDateWithFullMonthName, extractTime } from "../../../utils/parseInputDate";
import { IUser } from "../../../models/interfaces/employee.interface";
import './EmployeeTasksPage.scss';
import { format } from "date-fns";

interface LocationState {
    username: string;
}

const EmployeeTasks = () => {
    const [cookies] = useCookies(["token"]);
    const { userId }: { userId: string } = useParams();
    const location = useLocation<LocationState>();
    const {username} = location.state || ""; 
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const [timespans, setTimespans] = useState<ITimespan[]>([]);
    const history = useHistory();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedSegment, setSelectedSegment] = useState<string>(TIMESPAN_STATES.DONE);
    const [loading, setLoading] = useState<boolean>(false);
    const dateValue = format(new Date(), 'yyyy-MM-dd')+ 'T09:00:00.000Z';
    const handleSetSearch = (value: string) => setSearchText(value);

    const handleSegmentChange = (event: CustomEvent<SegmentChangeEventDetail>) => {
        setSelectedSegment(event.detail.value as string);
    };

    useIonViewWillEnter(() => {
        setLoading(true);
        setSearchText("");
        TIMESPAN_REQUEST.getTimespansByEmployee(+userId, setTimespans as React.Dispatch<SetStateAction<ITimespan[]>>, setLoading, setToastMessage);
        console.log(toastMessage);
    });

    const filteredTimespans = useMemo(() => 
        selectedSegment === TIMESPAN_STATES.INPROCESS
        ? timespans.filter(timespan => timespan.finishedAt === null && timespan.orderOperation.orderItem.name.toLowerCase().includes(searchText.toLowerCase()))
        : timespans.filter(timespan => timespan.finishedAt !== null && timespan.orderOperation.orderItem.name.toLowerCase().includes(searchText.toLowerCase()))
    , [timespans, selectedSegment, searchText]);

    const notFoundMessage = useMemo(() => 
        selectedSegment === TIMESPAN_STATES.INPROCESS
        ? t("timespans.notFound.inProcess")
        : t("timespans.notFound.done")
    , [selectedSegment]);

    return (
        <IonPage>
            <Header 
                title={username} 
                backButtonHref={ROUTES.USERS}
                searchBar={Boolean(timespans?.length)} 
                searchText={searchText}
                onSearchChange={handleSetSearch}
            />
            <IonContent>        
                <div className="segment-wrapper ion-padding">
                    <IonSegment value={selectedSegment} onIonChange={handleSegmentChange}>
                        <IonSegmentButton value={TIMESPAN_STATES.INPROCESS}>
                            <IonLabel>{t("timespans.inProcess")}</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value={TIMESPAN_STATES.DONE}>
                            <IonLabel>{t("timespans.done")}</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>
                <IonList>
                    {filteredTimespans.length>0? filteredTimespans.map(timespan => (
                        <IonItem key={timespan.timespanId} className="timespan-item" onClick={() => {if (selectedSegment === TIMESPAN_STATES.INPROCESS){
                            history.push(ROUTES.EMPLOYEE_TASK_EDIT(
                            String(timespan.timespanId), 
                          ),  { orderName: timespan.orderOperation.orderItem.name })}else{
                            history.push(ROUTES.EMPLOYEE_TASK_GET(String(timespan.timespanId)),  { orderName: timespan.orderOperation.orderItem.name });
                          }}}>
                            <IonLabel className="timespan-label"> 
                                <h2>{timespan.orderOperation.orderItem.name}</h2>
                                <div className="timespan-item-columns">
                                    <div className="timespan-item-column">
                                        <IonIcon slot="start" style={{ fontSize: "24px" }} icon={Calendar} /><p>{formatDateWithFullMonthName(timespan.startedAt, currentLanguage)}</p> 
                                    </div>
                                    <div className="timespan-item-column">
                                        <IonIcon slot="start" style={{ fontSize: "24px" }} icon={Clock} /><p>{extractTime(timespan.startedAt)} - {timespan.finishedAt? extractTime(timespan.finishedAt): ""}</p>
                                    </div>
                                </div>
                            </IonLabel>
                            <IonIcon slot="end" style={{ fontSize: "24px", marginRight: "0px"}} icon={ArrowRight}/>
                        </IonItem>
                    )):  <div className="not-found-message">{notFoundMessage}</div>}
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default EmployeeTasks;