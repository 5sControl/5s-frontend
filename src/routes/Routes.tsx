import { useEffect } from 'react';
import { LeftMenu } from '../components/leftMenu/leftMenu';
import { Outlet } from 'react-router-dom';
import { io } from 'socket.io-client';
import './modalDisk.scss';

export const RoutesOutlet = () => {

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
    });
  }, []);

  return (
    <>
      <div className="window">
        <LeftMenu />
        <section className="outlet">
          <Outlet />
        </section>
      </div>
    </>
  );
};
