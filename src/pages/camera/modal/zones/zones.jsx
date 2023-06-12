import { useEffect, useState } from 'react';
import styles from './zones.module.scss';
import { ZonesCoordinates } from './coordinates/zonesCoordinates';
import { ZoneList } from './zoneList/zoneList';
import { getCameraZones, patchCameraZones, postCameraZones } from '../../../../api/cameraRequest';
import { useCookies } from 'react-cookie';
import { NoVideoBig } from '../../../../assets/svg/SVGcomponent';

export const Zones = ({ cameraSelect, isCreateCamera }) => {
  const [coords, setCoords] = useState([]);
  const [itemName, setItemName] = useState('');
  const [isScale, setIsScale] = useState(false);
  const [cookie] = useCookies(['token']);
  const [cameraZones, setCameraZones] = useState([]);
  const [currentZoneId, setCurrentZoneId] = useState();
  const [workplace, setWorkplace] = useState({});

  const saveZone = () => {
    const body = {
      coords: coords,
      camera: cameraSelect.id,
      name: itemName,
      index_workplace: 1,
      workplace: 'Okucia',
    };
    if (currentZoneId === -1) {
      postCameraZones(window.location.hostname, cookie.token, body).then(() => {
        console.log('created zone');
      });
    } else {
      patchCameraZones(window.location.hostname, cookie.token, body, currentZoneId).then(() => {
        console.log('updated zone');
      });
    }
  };

  useEffect(() => {
    const buf = cameraZones.filter((el) => el.id === currentZoneId);
    console.log(buf);
    if (buf.length > 0) {
      setItemName(buf[0].name);
    }
  }, [currentZoneId]);

  useEffect(() => {
    getCameraZones(window.location.hostname, cookie.token, cameraSelect.id)
      .then((res) => {
        setCameraZones(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cameraSelect]);

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
            cameraBox={cameraZones.filter((box) => box.id !== currentZoneId)}
            oldBox={cameraZones.filter((box) => box.id === currentZoneId)}
            currentZoneId={currentZoneId}
          />
          <div className={styles.zones__right}>
            <ZoneList
              saveZone={saveZone}
              cameraZones={cameraZones}
              setItemName={(name) => setItemName(name)}
              itemName={itemName}
              setCurrentZoneId={(id) => setCurrentZoneId(id)}
            />
          </div>
        </div>
      )}
    </>
  );
};
