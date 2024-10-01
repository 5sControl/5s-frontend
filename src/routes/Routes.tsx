/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';

import { NotificationSocket } from '../components/notificationSocket/notification';
import { LeftMenu } from '../components/leftMenu/leftMenu';

export const RoutesOutlet = () => {
  const [notification, setNotification] = useState<any[]>([]);

  const closeNotification = (id: number) => {
    setNotification(notification.filter((el, index) => index !== id));
  };

  const addNotification = (message: any) => {
    setNotification((prevNotification: any[]) => {
      if (prevNotification.length > 0) {
        return [...prevNotification, message];
      } else {
        return [message];
      }
    });
  };

  useEffect(() => {
    const socket = io(process.env.REACT_APP_NGROK, {
      path: '/socket/onvif',
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    socket.on('connect', function () {
      console.log('Connected to the server');
    });

    socket.on('notification', function (msg) {
      addNotification(msg);
    });
  }, []);

  return (
    <>
      <div className='window'>
        {/* <LeftMenu /> */}
        <section className='outlet'>
          <Outlet />
        </section>
      </div>
      {notification && (
        <NotificationSocket
          notifications={notification}
          closeNotification={(id: number) => closeNotification(id)}
        />
      )}
    </>
  );
};
