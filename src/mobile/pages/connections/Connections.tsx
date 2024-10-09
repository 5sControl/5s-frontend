import React, { useEffect, useState } from "react";
import { IonContent, IonList, IonItem } from "@ionic/react";
import { getConnectionsToDatabases } from "../../api/connections";
import { useCookies } from "react-cookie";
import { ConnectionsList } from "../../components/connectionsList/ConnectionsList";
import { Preloader } from "../../../components/preloader";
import { ConnectionItem } from "../../models/interfaces/connectionItem.interface";
import { ROUTES } from "../../../shared/constants/routes";
import { Header } from "../../components/header/Header";
import {useTranslation} from "react-i18next";

const Connections: React.FC = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();

  useEffect(() => {
    setLoading(true);
    getConnectionsToDatabases("", cookies.token)
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cookies.token]);

  return (
    <IonContent>
      <Header title={t('config.erp')} backButtonHref={ROUTES.CONFIGURATION} />
      {loading ? (
        <div className="preloader">
          <Preloader />
        </div>
      ) : (
        items.length === 0 ? (
          <IonList inset={true}>
            <IonItem>{t('messages.noDatabases')}</IonItem>
          </IonList>
        ) : (
          <ConnectionsList items={items} />
        )
      )}
    </IonContent>
  );
};

export default Connections;
