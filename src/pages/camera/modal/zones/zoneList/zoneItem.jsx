import Combobox from 'react-widgets/Combobox';
import { ArrowDown, DeleteWhite } from '../../../../../assets/svg/SVGcomponent';
import { Input } from '../../../../../components/input';
import { Button } from '../../../../../components/button';
import styles from '../zones.module.scss';
import { useEffect, useState } from 'react';

export const Item = ({
  workplaceList,
  saveZone,
  deleteZone,
  name,
  workplace,
  setItemName,
  itemName,
  isOpen,
  setCurrentZoneId,
  zona,
  currentZoneId,
  setWorkplaceToSend,
  workplaceComboBox,
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
    if (!isShow && !isOpen) {
      setCurrentZoneId(-1);
    }
  }, [isShow]);

  const comboboxHandler = (value) => {
    setWorkplaceToSend(workplaceList.filter((item) => item.comboBoxName === value)[0]);
  };

  return (
    <div className={styles.item}>
      <div className={styles.zona}>
        <div className={styles.zona__left}>
          <span className={styles.zona__name}>Name: {name}</span>
          <span className={styles.zona__workplace}>Workplace: {workplace?.operationName}</span>
        </div>
        <span className={styles.zona__right} onClick={showHandler}>
          <ArrowDown className={isShow && currentZoneId === zona.id ? styles.rotate : ''} />
        </span>
      </div>

      {isShow && currentZoneId === zona.id && (
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
              data={workplaceList.map((e) => e.comboBoxName)}
              placeholder="Select or enter"
              hideEmptyPopup
              value={workplaceComboBox}
              onChange={(value) => comboboxHandler(value)}
              onSelect={(value) => comboboxHandler(value)}
              className={styles.item__combobox}
              selectIcon={<ArrowDown />}
            />
          </label>
          <p className={styles.item__description}>Select one or more areas on the left.</p>
          <div className={styles.item__footer}>
            <Button
              text={'Delete'}
              IconLeft={DeleteWhite}
              type="button"
              className={styles.item__delete}
              onClick={
                currentZoneId === -1 ? () => setCurrentZoneId(-2) : () => deleteZone(currentZoneId)
              }
            />
            <div className={styles.item__footer_control}>
              <Button text="Cancel" variant="text" onClick={() => setCurrentZoneId(-2)} />
              <Button text="Save" onClick={saveZone} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
