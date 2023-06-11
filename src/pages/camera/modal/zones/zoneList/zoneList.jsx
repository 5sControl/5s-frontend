import { Button } from '../../../../../components/button';
import styles from '../zones.module.scss';
export const ZoneList = ({ saveZone, cameraZones }) => {
  return (
    <div className={styles.list}>
      <div className={styles.item}>
        <div className={styles.item__edit}>
          ываываыва
          <Button text="Save" onClick={saveZone} />
        </div>
      </div>
      {cameraZones.map((zona, index) => (
        <div className={styles.item} key={index}>
          <div className={styles.item__edit}>
            <Button text="Save" onClick={saveZone} />
          </div>
        </div>
      ))}
    </div>
  );
};
