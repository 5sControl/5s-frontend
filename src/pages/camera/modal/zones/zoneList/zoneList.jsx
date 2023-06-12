import { useEffect, useState } from 'react';
import styles from '../zones.module.scss';
import { getWorkplaceList } from '../../../../../api/orderView';
import { useCookies } from 'react-cookie';
import { Item } from './zoneItem';

export const ZoneList = ({ saveZone, cameraZones }) => {
  const [cookie] = useCookies(['token']);
  const [workplaceList, setWorkplaceList] = useState([]);
  const [updateZone, setUpdateZone] = useState([]);
  const [isBlickAdd, setIsBlockAdd] = useState(false);
  useEffect(() => {
    setUpdateZone([...cameraZones]);
    getWorkplaceList(window.location.hostname, cookie.token).then((res) => {
      setWorkplaceList(res.data.map((place) => place.operationName));
      console.log(res.data);
    });
  }, []);

  const addZoneHandler = () => {
    setIsBlockAdd(true);
    setUpdateZone([
      ...updateZone,
      {
        id: -1,
        name: '',
        workplace: '',
      },
    ]);
  };
  return (
    <>
      <div className={styles.zones__header}>
        <span> Zones</span>
        <span className={`${isBlickAdd ? styles.added : styles.add}`} onClick={addZoneHandler}>
          + Add Zone
        </span>
      </div>

      <div className={styles.list}>
        {cameraZones.map((zona, index) => (
          <Item
            key={index}
            workplaceList={workplaceList}
            saveZone={saveZone}
            name={zona.name}
            workplace={zona.workplace}
          />
        ))}
      </div>
    </>
  );
};
