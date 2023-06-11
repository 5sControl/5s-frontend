import { useEffect, useState } from 'react';
import styles from './zones.module.scss';
import { ZonesCoordinates } from './coordinates/zonesCoordinates';
import { ZoneList } from './zoneList/zoneList';
import { getCameraZones, postCameraZones } from '../../../../api/cameraRequest';
import { useCookies } from 'react-cookie';

export const Zones = ({ cameraSelect }) => {
  const [coords, setCoords] = useState([]);
  const [itemName, setItemName] = useState('');
  const [isScale, setIsScale] = useState(false);
  const [cookie] = useCookies(['token']);
  const [cameraZones, setCameraZones] = useState([]);

  const saveZone = () => {
    const body = {
      coords: coords,
      camera: cameraSelect.id,
      name: 'zone1',
    };
    console.log(coords);
    postCameraZones(window.location.hostname, cookie.token, body);
  };

  useEffect(() => {
    getCameraZones(window.location.hostname, cookie.token, cameraSelect.id)
      .then((res) => {
        setCameraZones(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.zones}>
      <ZonesCoordinates
        currentSelect={cameraSelect.id}
        setCoords={(coords) => setCoords(coords)}
        itemName={itemName}
        isScale={isScale}
        setIsScale={(e) => setIsScale(e)}
      />
      <div className={styles.zones__right}>
        <div className={styles.zones__header}>
          <span> Zones</span>
          <span className={styles.add}> + Add Zone</span>
        </div>
        <ZoneList saveZone={saveZone} cameraZones={cameraZones} />
      </div>
    </div>
  );
};
