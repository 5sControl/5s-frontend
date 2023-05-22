import { useEffect, useState } from 'react';
import { LeftMenu } from '../components/leftMenu/leftMenu';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import './modalDisk.scss';
import { NotificationSocket } from '../components/notificationSocket/notification';

export const RoutesOutlet = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notification, setNotification] = useState<any>(false);

  const handleClose = () => {
    setNotification(false);
  };

  useEffect(() => {
    const socket = io(
      `http://${
        window.location.hostname.includes('local') ? '192.168.1.110' : window.location.hostname
      }:3456`
    );
    socket.on('connect', function () {
      console.log('Connected to the server');
    });

    socket.on('notification', function (msg) {
      console.log(msg, 'msg');
      setNotification(msg);
    });
  }, []);

  console.log(notification);
  return (
    <>
      <div className="window">
        <LeftMenu />
        <section className="outlet">
          <Outlet />
        </section>
      </div>
      {notification && (
        <div>
          <NotificationSocket message={notification.message} close={handleClose} />
        </div>
      )}
    </>
  );
};
