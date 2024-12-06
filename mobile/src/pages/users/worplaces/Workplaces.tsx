import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useEffect, useState } from "react";
import SelectList from "../../../components/selects/selectList/SelectList";
import { IWorkplace } from "../../../models/interfaces/workplace.interface";
import { getWorkplaces } from "../../../api/users";
import { useCookies } from "react-cookie";
import { SelectItem } from "../../../models/types/selectItem";
import { Preloader } from "../../../components/preloader/preloader";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedWorkplace } from "../../../store/workpaceSlice";
import { useHistory } from "react-router";

const Workplaces = () => {
  const dispatch = useDispatch();
  const { selectedWorkplace } = useSelector((state: any) => state.workplace);
  const [cookies] = useCookies(['token']);
  const [workplaces, setWorkplaces] = useState<SelectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const history = useHistory();

  useIonViewWillEnter(() => {
    getWorkplaces(cookies.token)
      .then(response => response.data)
      .then(data => {
        setWorkplaces(data.map((e: IWorkplace) => {
            return {
                id: e.id,
                label: e.name,
                value: e.id.toString() 
            }
        }));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const handleWorkplaceChange = (e: CustomEvent) => {
    const selectedId = Number(e.detail.value);
    const selectedWorkplace = workplaces.find(workplace => workplace.id.toString() === selectedId.toString());

    if (selectedWorkplace) {
      dispatch(setSelectedWorkplace({id: selectedId, name: selectedWorkplace.label}));
    }
  };

  useEffect(() => {
    const storedWorkplace = localStorage.getItem('selectedWorkplace');
    if (storedWorkplace) {
      dispatch(setSelectedWorkplace(JSON.parse(storedWorkplace)));
    }
  }, [dispatch]);

  const navigateBack = () => {
    history.push(ROUTES.USER_ADD, { direction: "back" });
  };

  return (
    <IonPage>
      <Header title={"Назначить рабочее место"} onBackClick={navigateBack} backButtonHref={ROUTES.USER_ADD}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">Loading...</div>
        ) : (
          <SelectList selectList={workplaces} value={selectedWorkplace?.id.toString()} handleChange={handleWorkplaceChange} />
        )}
      </IonContent>
    </IonPage>
  );
};
export default Workplaces;
