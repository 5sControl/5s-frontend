import { useCookies } from 'react-cookie';
import styles from '../style.module.scss';
import { getConnectionsToDatabases, patchStatusData } from '../../../api/connections';
import { useEffect, useState } from 'react';
import { ConnectionItem } from '../../../models/interfaces/connectionItem.interface';
import { IonChip, IonSkeletonText, IonSpinner } from '@ionic/react';
import './SelectConnection.scss'

type SelectConnectionProps = {
    changeHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SelectConnection: React.FC<SelectConnectionProps> = ({changeHandler}) => {
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [cookies] = useCookies(['token']);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);

  useEffect(() => {
    getConnectionsToDatabases(cookies.token)
    .then(response => {
        setConnections(response.data);
        setSelectedConnectionId(response.data.find((connection: ConnectionItem) => connection.used_in_orders_view)?.id);
        changeHandler(true);
      })
    .catch(error => console.error(error))
    .finally(() => setLoading(false));
  }, []);

  const changeActiveConnection = (id: number) => {
    patchStatusData(id, cookies.token, { used_in_orders_view: true });
    setSelectedConnectionId(id);
  };

  return (
    <div>
    {loading 
    ? <IonSpinner name="crescent" color="primary" />
    : connections.map((connection) => (
        <IonChip
          key={connection.id}
          onClick={(e) => changeActiveConnection(connection.id)}
          className={connection.id === selectedConnectionId ? "connection selectedConnection" : "connection"}
        >
          {connection.erp_system}
        </IonChip>
      ))}
    </div>
  );
};