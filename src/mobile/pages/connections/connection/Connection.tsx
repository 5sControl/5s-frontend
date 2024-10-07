import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonIcon, IonNote } from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import { getConnectionsToDatabases } from '../../../api/connections';
import { useCookies } from 'react-cookie';
import { ROUTES } from '../../../../shared/constants/routes';
import { DeleteCover, DeleteRedIcon, EditCover, EditOrangeIcon } from '../../../assets/svg/SVGcomponent';
import { capitalize } from '../../../utils/capitalize';
import { ConfirmationModal } from '../../../components/confirmationModal/confirmationModal';
import { Preloader } from '../../../../components/preloader';
import { ConnectionItem } from '../../../models/interfaces/connectionItem.interface';
import { Header } from '../../../components/header/Header';
import { ItemButton } from '../../../components/itemButton/ItemButton';

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
      <Header title={capitalize(currentConnection?.erp_system)} backButtonHref={ROUTES.CONNECTIONS} />
      {loading ? ( 
        <div className='preloader'>
          <Preloader />
        </div>
      ) : (
        <>
          <IonList inset={true}>
            <ItemButton label="Status" note={connected ? 'Used in Orders View' : 'Connected'} />
            <ItemButton label="Domain" note={currentConnection?.host} />
          </IonList>
          <IonList inset={true}>
            <ItemButton label={`${currentConnection?.erp_system} Database`} disabled={!connected} handleItemClick={() => handleDatabaseClick(ROUTES.DATABASE)}/>
          </IonList>
          <IonList inset={true}>
            <ItemButton label="Edit" labelColor={connected ? 'medium' : 'primary'} icon={connected ? EditCover : EditOrangeIcon} handleItemClick={() => navigate(ROUTES.CONNECTIONS_EDIT(id))} />
            <ItemButton label="Disconnect" labelColor={connected ? 'medium' : 'danger'} icon={connected ? DeleteCover : DeleteRedIcon}/>
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