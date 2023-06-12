import { useEffect, useState } from 'react';
import styles from './zones.module.scss';
import { ZonesCoordinates } from './coordinates/zonesCoordinates';
import { ZoneList } from './zoneList/zoneList';
import { getCameraZones, patchCameraZones, postCameraZones } from '../../../../api/cameraRequest';
import { useCookies } from 'react-cookie';
import { NoVideoBig } from '../../../../assets/svg/SVGcomponent';
import { getWorkplaceList } from '../../../../api/orderView';

export const Zones = ({ cameraSelect, isCreateCamera }) => {
  const [coords, setCoords] = useState([]);
  const [itemName, setItemName] = useState('');
  const [isScale, setIsScale] = useState(false);
  const [cookie] = useCookies(['token']);
  const [cameraZones, setCameraZones] = useState([]);
  const [currentZoneId, setCurrentZoneId] = useState();
  const [workplaceList, setWorkplaceList] = useState([]);
  const [workplaceToSend, setWorkplaceToSend] = useState(false);

  const getZone = () => {
    getCameraZones(window.location.hostname, cookie.token, cameraSelect.id)
      .then((res) => {
        setCameraZones(res.data);
        setCurrentZoneId(-2);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveZone = () => {
    const body = {
      coords: coords,
      camera: cameraSelect.id,
      name: itemName,
      index_workplace: workplaceToSend.id,
      workplace: workplaceToSend.name,
    };
    if (currentZoneId === -1) {
      postCameraZones(window.location.hostname, cookie.token, body).then(() => {
        console.log('created zone');
        getZone();
      });
    } else {
      patchCameraZones(window.location.hostname, cookie.token, body, currentZoneId).then(() => {
        console.log('updated zone');
        getZone();
      });
    }
  };

  useEffect(() => {
    getWorkplaceList(window.location.hostname, cookie.token).then((res) => {
      setWorkplaceList(
        res.data.map((place) => {
          return {
            ...place,
            comboBoxName: `${place.operationName} (id:${place.id})`,
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    const buf = cameraZones.filter((el) => el.id === currentZoneId);
    if (buf.length > 0) {
      setItemName(buf[0].name);
      if (currentZoneId > 0) {
        const sendWork = workplaceList.filter((el) => el.id === buf[0].index_workplace)[0];
        setWorkplaceToSend({
          name: sendWork.operationName,
          id: sendWork.id,
        });
      } else {
        setWorkplaceToSend({
          name: '',
          id: '',
        });
      }
    }
    console.log(buf[0]);
  }, [currentZoneId]);

  useEffect(() => {
    getZone();
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
              currentZoneId={currentZoneId}
              setWorkplaceToSend={(e) => setWorkplaceToSend(e)}
              workplaceList={workplaceList}
            />
          </div>
        </div>
      )}
    </>
  );
};
