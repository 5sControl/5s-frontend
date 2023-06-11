import styles from './zones.module.scss';
import { ZonseCoordinates } from './zonesCoordinates';

export const Zones = ({ cameraSelect }) => {
  console.log(cameraSelect);
  return (
    <div className={styles.zones}>
      <ZonseCoordinates />
      <div className={styles.zones__right}></div>
    </div>
  );
};
