import React from 'react';
import { LeftMenu } from '../components/leftMenu';
import { Outlet } from 'react-router-dom';

export const RoutesOutlet = () => {
  setInterval(() => {
    console.log('space');
  }, 20000);
  return (
    <div className="window">
      <LeftMenu />
      <section className="outlet">
        <Outlet />
      </section>
    </div>
  );
};
