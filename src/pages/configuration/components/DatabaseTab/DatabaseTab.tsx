import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../../../components/button';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';

import { getConnectionsToDB, selectConnectionPage } from '../../connectionSlice';
import {
  selectConnectToDbModal,
  setConnectionType,
  setCurrentConnectionData,
} from '../ConnectToDbModal/connectToDbModalSlice';
import { DisconnectDbModal } from '../DisconnectDbModal';
import {
  selectDisconnectDBModal,
  setConnectionToDisconnectData,
} from '../DisconnectDbModal/disconnectDbModalSlice';
import { Plus } from '../../../../assets/svg/SVGcomponent';

import s from '../../../configuration/configuration.module.scss';
import { AddConnectionModal } from '../ConnectToDbModal/AddConnectionModal';
import { ConnectionItem } from './ConnectionItem';
import { DatabaseInfo } from '../../types';
import { ConnectionModal } from '../ConnectToDbModal';

export const DatabaseTab: React.FC = () => {
  const [isModalAddConnection, setIsModalAddConnection] = useState(false);
  const [cookies] = useCookies(['token']);
  const { databases } = useAppSelector(selectConnectionPage);
  const { connectionType, currentConnectionData, connectResponse } =
    useAppSelector(selectConnectToDbModal);
  const { connectionToDisconnectData, disconnectDbResponse } =
    useAppSelector(selectDisconnectDBModal);
  const dispatch = useAppDispatch();

  const handleCloseConnectModal = () => {
    dispatch(setConnectionType(null));
    dispatch(setCurrentConnectionData(null));
  };

  const handleCloseDisconnectModal = () => {
    dispatch(setConnectionToDisconnectData(null));
  };

  const handleOpenModalAddConnection = () => {
    setIsModalAddConnection(true);
  };

  useEffect(() => {
    if (disconnectDbResponse == 204) {
      handleCloseDisconnectModal();
      dispatch(
        getConnectionsToDB({
          token: cookies.token,
          hostname: window.location.hostname,
        })
      );
    }
  }, [disconnectDbResponse]);

  useEffect(() => {
    if (connectResponse?.status) {
      handleCloseConnectModal();
      dispatch(
        getConnectionsToDB({
          token: cookies.token,
          hostname: window.location.hostname,
        })
      );
    }
  }, [connectResponse]);

  return (
    <>
      <AddConnectionModal
        isOpen={isModalAddConnection}
        handleClose={() => setIsModalAddConnection(false)}
      />

      <ConnectionModal
        handleClose={handleCloseConnectModal}
        type={connectionType}
        data={currentConnectionData}
      />

      <DisconnectDbModal
        connectionData={connectionToDisconnectData}
        handleClose={handleCloseDisconnectModal}
      />

      <Button
        text="Add connection"
        className={s.buttonPosition}
        onClick={handleOpenModalAddConnection}
        IconLeft={Plus}
      />

      {(databases?.results || []).map((result: DatabaseInfo, index) => (
        <ConnectionItem dataItem={result} key={index} />
      ))}
    </>
  );
};
