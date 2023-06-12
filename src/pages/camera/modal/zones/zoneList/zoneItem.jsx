import Combobox from 'react-widgets/Combobox';
import { ArrowDown, DeleteWhite } from '../../../../../assets/svg/SVGcomponent';
import { Input } from '../../../../../components/input';
import { Button } from '../../../../../components/button';
import styles from '../zones.module.scss';
import { useState } from 'react';
export const Item = ({ workplaceList, saveZone, name, workplace }) => {
  const [isShow, setIsShow] = useState(false);
  const showHandler = () => {
    setIsShow(!isShow);
  };
  return (
    <div className={styles.item}>
      <div className={styles.zona}>
        <div className={styles.zona__left}>
          <span className={styles.zona__name}>Name: {name}</span>
          <span className={styles.zona__workplace}>Workplace: {workplace}</span>
        </div>
        <span className={styles.zona__right} onClick={showHandler}>
          <ArrowDown className={isShow && styles.rotate} />
        </span>
      </div>

      {isShow && (
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
      )}
    </div>
  );
};
