import { useEffect, useState } from 'react';
import styles from '../zones.module.scss';
import { getWorkplaceList } from '../../../../../api/orderView';
import { useCookies } from 'react-cookie';
import { Item } from './zoneItem';

export const ZoneList = ({ saveZone, cameraZones, setItemName, itemName }) => {
  const [cookie] = useCookies(['token']);
  const [workplaceList, setWorkplaceList] = useState([]);
  const [isNewZone, setIsNewZone] = useState(false);
  const [isBlockAdd, setIsBlockAdd] = useState(false);

  useEffect(() => {
    getWorkplaceList(window.location.hostname, cookie.token).then((res) => {
      setWorkplaceList(res.data.map((place) => `${place.operationName} (id:${place.id})`));
      console.log(res.data);
    });
  }, []);

  const addZoneHandler = () => {
    setIsBlockAdd(true);
    setIsNewZone(true);
  };
  return (
    <>
      <div className={styles.zones__header}>
        <span> Zones</span>
        <span className={`${isBlockAdd ? styles.added : styles.add}`} onClick={addZoneHandler}>
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
            setItemName={(name) => setItemName(name)}
            itemName={itemName}
          />
        ))}
        {isNewZone && (
          <Item
            workplaceList={workplaceList}
            saveZone={saveZone}
            name={''}
            workplace={''}
            setItemName={(name) => setItemName(name)}
            itemName={itemName}
            isOpen={true}
          />
        )}
      </div>
    </>
  );
};
