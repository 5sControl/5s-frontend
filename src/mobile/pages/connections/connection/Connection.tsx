import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonToolbar, IonIcon, IonButtons, IonBackButton, IonNote } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { getConnectionsToDatabases } from '../../../api/connections';
import { useCookies } from 'react-cookie';
import { ROUTES } from '../../../../shared/constants/routes';
import { Delete, DeleteCover, DeleteRedIcon, Edit, EditCover, EditOrangeIcon } from '../../../assets/svg/SVGcomponent';
import { capitalize } from '../../../utils/capitalize';
import { ConfirmationModal } from '../../../components/confirmationModal/confirmationModal';
import { Preloader } from '../../../../components/preloader';
import { ConnectionItem } from '../../../models/interfaces/connectionItem.interface';

const Connection: React.FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const { id } = useParams() as { id: string };
  const [currentConnection, setCurrentConnection] = useState<ConnectionItem>();
  const [connected, setConnected] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); 

  const handleConfirmClick = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmConfirm = () => {
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    setLoading(true);
    getConnectionsToDatabases('', cookies.token)
      .then(response => {
        response.data.forEach((connection: ConnectionItem) => {
          connection.read_only = connection.erp_system !== '5s_control';
        });
        const connection = response.data.find((connection: ConnectionItem) => connection.id === parseInt(id));
        setCurrentConnection(connection);
        setConnected(connection?.is_active || false);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  const handleDatabaseClick = (path: string) => {
    if (connected) {
      navigate(path);
    }
  };

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref={ROUTES.CONNECTIONS} color="medium"></IonBackButton>
          </IonButtons>
          <IonTitle>{capitalize(currentConnection?.erp_system)} connection</IonTitle>
        </IonToolbar>
      </IonHeader>
      {loading ? ( 
        <div className='preloader'>
          <Preloader />
        </div>
      ) : (
        <>
          <IonList inset={true}>
            <IonItem>
              <IonLabel className="capitalized">Status</IonLabel>
              <IonNote slot="end" color="medium">{connected ? 'Used in Orders View' : 'Connected'}</IonNote>
            </IonItem>
            <IonItem>
              <IonLabel className="capitalized">Domain</IonLabel>
              <IonNote slot="end" color="medium">{currentConnection?.host}</IonNote>
            </IonItem>
          </IonList>
          <IonList inset={true}>
            <IonItem button disabled={!connected} onClick={() => handleDatabaseClick(ROUTES.DATABASE)}>
              <IonLabel className="capitalized">{currentConnection?.erp_system} Database</IonLabel>
            </IonItem>
          </IonList>
          <IonList inset={true}>
            <IonItem onClick={() => navigate(ROUTES.CONNECTIONS_EDIT(id))}>
              <IonIcon slot="start" icon={connected ? EditCover : EditOrangeIcon} />
              <IonLabel color={connected ? 'medium' : 'primary'}>Edit</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={connected ? DeleteCover : DeleteRedIcon} />
              <IonLabel color={connected ? 'medium' : 'danger'}>Disconnect</IonLabel>
            </IonItem>
          </IonList>
          <ConfirmationModal 
            isOpen={showConfirmationModal} 
            onClose={handleCloseModal} 
            onConfirm={handleConfirmConfirm}
            title="Disconnect from ERP?"
            description="Disconnecting from database will result in inability to view orders in Orders View."
            confirmText="Disconnect"
            cancelText="Cancel"
          />
        </>
      )}
    </IonContent>
  );
};

export default Connection;