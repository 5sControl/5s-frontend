import { useEffect, useState } from 'react';
import styles from './zones.module.scss';
import { ZonesCoordinates } from './coordinates/zonesCoordinates';
import { ZoneList } from './zoneList/zoneList';
import {
  getCameraZones,
  patchCameraZones,
  postCameraZones,
  deleteCameraZones,
} from '../../../../api/cameraRequest';
import { useCookies } from 'react-cookie';
import { NoVideoBig } from '../../../../assets/svg/SVGcomponent';
import { getWorkplaceList } from '../../../../api/orderView';
import { Preloader } from '../../../../components/preloader';
import { Notification } from '../../../../components/notification/notification';

export const Zones = ({ cameraSelect, isCreateCamera }) => {
  const [coords, setCoords] = useState([]);
  const [itemName, setItemName] = useState('');
  const [isScale, setIsScale] = useState(false);
  const [cookie] = useCookies(['token']);
  const [cameraZones, setCameraZones] = useState([]);
  const [currentZoneId, setCurrentZoneId] = useState();
  const [workplaceList, setWorkplaceList] = useState([]);
  const [workplaceToSend, setWorkplaceToSend] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [preloader, setPreloader] = useState(false);
  const [message, setMessage] = useState(false);
  const [createZoneMode, setCreateZoneMode] = useState(false);

  const getZone = () => {
    setPreloader(true);
    getCameraZones(window.location.hostname, cookie.token, cameraSelect.id)
      .then((res) => {
        setCameraZones(res.data);
        setCurrentZoneId(-2);
        setCoords([]);
        setPreloader(false);
      })
      .catch((err) => {
        console.log(err);
        setPreloader(false);
      });
  };

  const deleteZone = (id) => {
    setPreloader(true);
    deleteCameraZones(window.location.hostname, cookie.token, id)
      .then(() => {
        setMessage({ status: true, message: 'Zone was deleted' });
        getZone();
      })
      .catch((err) => {
        console.log(err);
        setMessage({ status: false, message: 'Zone was not deleted' });
        setPreloader(false);
      });
  };

  const saveZone = () => {
    const otherZones = cameraZones.filter((box) => box.id !== currentZoneId);

    if (coords.length == 0) {
      setMessage({ status: false, message: 'Select zone' });
      return;
    }

    for (let i = 0; i < otherZones.length; i++) {
      for (let n = 0; n < otherZones[i].coords.length; n++) {
        const otherCoords = otherZones[i].coords[n];

        const overlap = !(
          coords[0].x1 > otherCoords.x2 ||
          coords[0].x2 < otherCoords.x1 ||
          coords[0].y1 > otherCoords.y2 ||
          coords[0].y2 < otherCoords.y1
        );

        if (overlap) {
          setMessage({ status: false, message: 'Zones must not overlap' });
          return;
        }
      }
    }

    const body = {
      coords: coords,
      camera: cameraSelect.id,
      name: itemName,
    };
    if (workplaceToSend) {
      body.index_workplace = workplaceToSend.id;
      body.workplace = workplaceToSend.operationName;
    }
    if (currentZoneId === -1) {
      setPreloader(true);
      postCameraZones(window.location.hostname, cookie.token, body)
        .then(() => {
          getZone();
          setMessage({ status: true, message: 'Zone is save' });
        })
        .catch((error) => {
          console.log(error);
          setPreloader(false);
          setMessage({ status: false, message: 'Zone not save' });
        });
    } else {
      setPreloader(true);
      patchCameraZones(window.location.hostname, cookie.token, body, currentZoneId)
        .then(() => {
          getZone();
          setMessage({ status: true, message: 'Zone is save' });
        })
        .catch((error) => {
          console.log(error);
          setPreloader(false);
          setMessage({ status: false, message: 'Zone not save' });
        });
    }
  };

  useEffect(() => {
    getZone();
    getWorkplaceList(window.location.hostname, cookie.token)
      .then((res) => {
        setWorkplaceList(
          res.data.map((place) => {
            return {
              ...place,
              comboBoxName: `${place.operationName} (id:${place.id})`,
            };
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updating]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(false);
      }, 2000);
    }
  }, [message]);

  useEffect(() => {
    const buf = cameraZones.filter((el) => el.id === currentZoneId);
    if (buf.length > 0) {
      const sendWork = workplaceList.filter((el) => el.id === buf[0].index_workplace);
      setItemName(buf[0].name);
      if (currentZoneId > 0 && sendWork && sendWork.length > 0) {
        setWorkplaceToSend({
          operationName: sendWork[0].operationName,
          id: sendWork[0].id,
          comboBoxName: `${sendWork[0].operationName} (${sendWork[0].id})`,
        });
      } else {
        setWorkplaceToSend(false);
      }
    }
  }, [currentZoneId]);

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
            createZoneMode={createZoneMode}
          />
          <div className={styles.zones__right}>
            <ZoneList
              saveZone={saveZone}
              deleteZone={deleteZone}
              cameraZones={cameraZones}
              setItemName={(name) => setItemName(name)}
              itemName={itemName}
              setCurrentZoneId={(id) => setCurrentZoneId(id)}
              currentZoneId={currentZoneId}
              setWorkplaceToSend={(e) => setWorkplaceToSend(e)}
              workplaceList={workplaceList}
              workplace={workplaceToSend ? workplaceToSend.comboBoxName : ''}
              isNewZone={createZoneMode}
              setIsNewZone={setCreateZoneMode}
            />
          </div>
        </div>
      )}
      {preloader && (
        <div className={styles.preloader}>
          <Preloader />
        </div>
      )}
      {message && <Notification status={message.status} message={message.message} />}
    </>
  );
};
