import styles from './zones.module.scss';
import { ZonesCoordinates } from './zonesCoordinates';

export const Zones = ({ cameraSelect }) => {
  console.log(cameraSelect);
  return (
    <div className={styles.zones}>
      <ZonesCoordinates currentSelect={cameraSelect.id} />
      <div className={styles.zones__right}></div>
    </div>
  );
};
