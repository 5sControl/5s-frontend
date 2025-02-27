import { IonContent, IonList, IonSegment, IonSegmentButton, SegmentChangeEventDetail, IonIcon, IonItem, IonLabel, IonPage, useIonViewWillEnter, IonButton, IonToast } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useState, useMemo, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { TIMESPAN_STATES } from "../../../models/enums/timespansStates.enum";
import { TIMESPAN_REQUEST } from "../../../dispatcher";
import { ITimespan } from "../../../models/interfaces/orders.interface";
import { Calendar, ArrowRight, Clock } from "../../../assets/svg/SVGcomponent";
import { formatDateWithFullMonthName, extractTime } from "../../../utils/parseInputDate";
import './EmployeeTasksPage.scss';
import { useAppSelector } from "../../../store";
import { ROLE } from "../../../models/enums/roles.enum";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";

const EmployeeTasks = () => {
    const { userId }: { userId: string } = useParams();
    const { role } = useAppSelector(state => state.user);
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;
    const [timespans, setTimespans] = useState<ITimespan[]>([]);
    const history = useHistory();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedSegment, setSelectedSegment] = useState<string>(TIMESPAN_STATES.INPROCESS);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSetSearch = (value: string) => setSearchText(value);

    const [finishModalOpen, setFinishModalOpen] = useState<boolean>(false);
    const [timespanToFinish, setTimespanToFinish] = useState<ITimespan | null>(null);
    const showToastMessage = (message: string) => {
        setToastMessage(message);
    };

    const handleSegmentChange = (event: CustomEvent<SegmentChangeEventDetail>) => {
        setSelectedSegment(event.detail.value as string);
    };

    useIonViewWillEnter(() => {
        setLoading(true);
        setSearchText("");
        TIMESPAN_REQUEST.getTimespansByEmployee(+userId, setTimespans as React.Dispatch<SetStateAction<ITimespan[]>>, setLoading, setToastMessage);
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
 
    const onBackClick = () => {
        history.go(-1);
    }

    // const handleNavigate = () => {
    //     history.go(-1);
    //     closeFinishModal();
    // };

    const openFinishModal = (timespan: ITimespan) => {
        setTimespanToFinish(timespan);
        setFinishModalOpen(true);
    };

    const closeFinishModal = () => {
        setTimespanToFinish(null);
        setFinishModalOpen(false);
    };

    const confirmFinishTimespan = async () => {
        if (!timespanToFinish) return;
        try {
            await TIMESPAN_REQUEST.updateTimespan(
                timespanToFinish.timespanId,
                { 
                  startedAt: timespanToFinish.startedAt, 
                  finishedAt: new Date().toISOString()
                },
                setLoading,
                setToastMessage,
                // handleNavigate
            ).catch(() =>{
                setToastMessage(t("orders.timeOverlap"));
            });
            showToastMessage(t("messages.successFinish"));
            closeFinishModal();

            TIMESPAN_REQUEST.getTimespansByEmployee(
                +userId, 
                setTimespans as React.Dispatch<SetStateAction<ITimespan[]>>, 
                setLoading, 
                setToastMessage
            );
        } catch (error) {
            showToastMessage(t("messages.errorFinish"));
        }
    };

    return (
        <IonPage>
            <Header 
                title={role == ROLE.ADMIN ? t("text.tasks") : t("menu.myTasks")} 
                backButtonHref={ROUTES.USERS}
                onBackClick={onBackClick}
                searchBar={Boolean(timespans?.length)} 
                searchPlaceholder={t("operations.tasks.search")}
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
                {selectedSegment === TIMESPAN_STATES.INPROCESS && filteredTimespans.length === 1 && (
                  <div className="ion-padding">
                    <IonButton 
                      expand="block" 
                      onClick={() => openFinishModal(filteredTimespans[0])}
                    >
                      {t("operations.finish")}
                    </IonButton>
                  </div>
                )}

                <ConfirmationModal
                 type="primary"
                  isOpen={finishModalOpen}
                  onClose={closeFinishModal}
                  onConfirm={confirmFinishTimespan}
                  title={t("operations.saveChanges")}
                  confirmText={t("operations.save")}
                  cancelText={t("operations.cancel")}
                />

                <IonToast
                  position="top"
                  isOpen={!!toastMessage}
                  message={toastMessage || undefined}
                  duration={3000}
                  onDidDismiss={() => setToastMessage(null)}
                />
            </IonContent>
        </IonPage>
    );
}

export default EmployeeTasks;