import { useEffect, useState } from 'react';
import { Button } from '../../../../../components/button';
import styles from '../zones.module.scss';
import { getWorkplaceList } from '../../../../../api/orderView';
import { useCookies } from 'react-cookie';
import Combobox from 'react-widgets/Combobox';
import { ArrowDown, DeleteWhite } from '../../../../../assets/svg/SVGcomponent';
import { Input } from '../../../../../components/input';
export const ZoneList = ({ saveZone, cameraZones }) => {
  const [cookie] = useCookies(['token']);
  const [workplaceList, setWorkplaceList] = useState([]);

  useEffect(() => {
    getWorkplaceList(window.location.hostname, cookie.token).then((res) => {
      setWorkplaceList(res.data.map((place) => place.operationName));
      console.log(res.data);
    });
  }, []);

  return (
    <div className={styles.list}>
      <div className={styles.item}>
        <div className={styles.zona}>
          <div className={styles.zona__left}>
            <span className={styles.zona__name}>Full camera</span>
            <span className={styles.zona__workplace}>Workplace: -</span>
          </div>
          <span className={styles.zona__right}>
            <ArrowDown />
          </span>
        </div>

        <div className={styles.item__edit}>
          <label>
            Name
            <Input className={styles.item__input} />
          </label>
          <label>
            Controlled workplace
            <Combobox
              data={workplaceList}
              placeholder="Select or enter"
              hideEmptyPopup
              // value={cameraIP}
              // onChange={(value) => setCameraIP(value)}
              // onSelect={(value) => setCameraIP(value)}
              className={styles.item__combobox}
              selectIcon={<ArrowDown />}
            />
          </label>
          <p className={styles.item__description}>Select the area on the left.</p>
          <div className={styles.item__footer}>
            <Button
              text={'Delete'}
              IconLeft={DeleteWhite}
              type="button"
              className={styles.item__delete}
              //   onClick={() => onDelete('algorithm')}
            />
            <div className={styles.item__footer_control}>
              <Button text="Cancel" variant="text" />
              <Button text="Save" onClick={saveZone} />
            </div>
          </div>
        </div>
      </div>
      {cameraZones.map((zona, index) => (
        <div className={styles.item} key={index}>
          {/* <div className={styles.item__edit}>
            <Button text="Save" onClick={saveZone} />
          </div> */}
        </div>
      ))}
    </div>
  );
};
