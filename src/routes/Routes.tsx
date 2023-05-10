import { useEffect, useState } from 'react';
import { getMemoryStatus } from '../api/companyRequest';
import { useCookies } from 'react-cookie';

import { LeftMenu } from '../components/leftMenu/leftMenu';
import { Outlet } from 'react-router-dom';
import { Button } from '../components/button';
import { Warning } from '../assets/svg/SVGcomponent';

import './modalDisk.scss';

export const RoutesOutlet = () => {
  const [isMemory, setIsMemory] = useState<boolean>(true);

  const [cookies] = useCookies(['token']);

  useEffect(() => {
    getMemoryStatus(window.location.hostname, cookies.token).then((response) =>
      setIsMemory(response.data.has_enough_space)
    );
    const intervalId = setInterval(() => {
      getMemoryStatus(window.location.hostname, cookies.token).then((response) =>
        setIsMemory(response.data.has_enough_space)
      );
    }, 1800000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="window">
        <LeftMenu />
        <section className="outlet">
          <Outlet />
        </section>
      </div>
      {!isMemory && (
        <section className="modalDisk">
          <div className="modalDisk__modal">
            <h1>Low disk space</h1>
            <div className="modalDisk__modal_warning">
              <Warning className="modalDisk__modal_svg" />
            </div>
            <p>
              The server is running low on memory. Free up its space to avoid losing old videos that
              will be replaced by new ones.
            </p>
            <Button text="Ok" onClick={() => setIsMemory(true)} />
          </div>
        </section>
      )}
    </>
  );
};
