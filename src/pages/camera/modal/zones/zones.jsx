import { useEffect, useState } from 'react';
import styles from './zones.module.scss';
import { ZonesCoordinates } from './coordinates/zonesCoordinates';
import { ZoneList } from './zoneList/zoneList';
import { getCameraZones, postCameraZones } from '../../../../api/cameraRequest';
import { useCookies } from 'react-cookie';
import { NoVideoBig } from '../../../../assets/svg/SVGcomponent';

export const Zones = ({ cameraSelect, isCreateCamera }) => {
  console.log(isCreateCamera);
  const [coords, setCoords] = useState([]);
  const [itemName, setItemName] = useState('');
  const [isScale, setIsScale] = useState(false);
  const [cookie] = useCookies(['token']);
  const [cameraZones, setCameraZones] = useState([]);
  const [cameraBox, setCameraBox] = useState([]);

  const saveZone = () => {
    const body = {
      coords: coords,
      camera: cameraSelect.id,
      name: 'zone1',
    };
    console.log(coords);
    postCameraZones(window.location.hostname, cookie.token, body).then(() => {
      console.log('created zone');
    });
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
    <>
      {isCreateCamera ? (
        <section className={styles.creating}>
          <NoVideoBig />
          <p>Not connected to the camera. Check your connection in ‘Camera’ tab.</p>
        </section>
      ) : (
        <div className={styles.zones}>
          <ZonesCoordinates
            currentSelect={cameraSelect.id}
            setCoords={(coords) => setCoords(coords)}
            itemName={itemName}
            isScale={isScale}
            setIsScale={(e) => setIsScale(e)}
            cameraBox={cameraZones}
          />
          <div className={styles.zones__right}>
            <ZoneList saveZone={saveZone} cameraZones={cameraZones} />
          </div>
        </div>
      )}
    </>
  );
};
