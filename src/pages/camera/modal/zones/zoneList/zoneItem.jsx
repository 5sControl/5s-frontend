import Combobox from 'react-widgets/Combobox';
import { ArrowDown, DeleteWhite } from '../../../../../assets/svg/SVGcomponent';
import { Input } from '../../../../../components/input';
import { Button } from '../../../../../components/button';
import styles from '../zones.module.scss';
import { useEffect, useState } from 'react';

export const Item = ({
  workplaceList,
  saveZone,
  name,
  workplace,
  setItemName,
  itemName,
  isOpen,
  setCurrentZoneId,
  zona,
}) => {
  const [isShow, setIsShow] = useState(isOpen);

  const showHandler = () => {
    setCurrentZoneId(zona.id);
    setIsShow(!isShow);
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentZoneId(-1);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isShow) {
      setCurrentZoneId(-2);
    }
  }, [isShow]);
  return (
    <div className={styles.item}>
      <div className={styles.zona}>
        <div className={styles.zona__left}>
          <span className={styles.zona__name}>Name: {name}</span>
          <span className={styles.zona__workplace}>Workplace: {workplace}</span>
        </div>
        <span className={styles.zona__right} onClick={showHandler}>
          <ArrowDown className={isShow ? styles.rotate : ''} />
        </span>
      </div>

      {isShow && (
        <div className={styles.item__edit}>
          <label>
            Name
            <Input
              className={styles.item__input}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </label>
          <label>
            Controlled workplace
            <Combobox
              data={workplaceList}
              placeholder="Select or enter"
              hideEmptyPopup
              value={workplace}
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
