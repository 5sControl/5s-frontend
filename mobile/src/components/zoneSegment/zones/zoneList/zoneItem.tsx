import { ArrowDown, DeleteWhite } from '../../../../assets/svg/SVGcomponent';
import { Input } from '../../../inputs/input/Input';
import styles from '../zones.module.scss';
import { useEffect, useState } from 'react';
import Select from '../../../selects/select/Select';
import { DeleteButton } from '../../../deleteButton/DeleteButton';
import { IonButton } from '@ionic/react';

const Item = ({
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
  numberOfZones,
}) => {
  const [isShow, setIsShow] = useState(isOpen);
  const [value, setValue] = useState(workplaceComboBox);

  const comboboxHandler = (value) => {
    if (value?.detail){
      setValue(value.detail.value);
      setWorkplaceToSend(workplaceList.filter((item) => item.value === value.detail.value)[0]);
    }
    else{
      setValue(value);
      setWorkplaceToSend(workplaceList.filter((item) => item.value === value)[0]);
    }
  };

  const showHandler = () => {
    setCurrentZoneId(zona.id);
    setIsShow(!isShow);
    comboboxHandler(workplace?.value);
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentZoneId(-1);
      setItemName(`Zone ${numberOfZones + 1}`);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isShow && !isOpen) {
      setCurrentZoneId(-2);
    }
  }, [isShow]);

  return (
    <div className={styles.item}>
      <div className={styles.zona}>
        <div className={styles.zona__left}>
          <span className={styles.zona__name}>Name: {name}</span>
          <span className={styles.zona__workplace}>
            Workplace: {workplace?.operationName || zona.workplace}
          </span>
        </div>
        <span className={styles.zona__right} onClick={showHandler}>
          <img src={ArrowDown} className={isShow && currentZoneId === zona.id ? styles.rotate : ''} />
        </span>
      </div>

      {isShow && currentZoneId === zona.id && (
        <div className={styles.item__edit}>
            <Input
              label="Name"
              required
              value={itemName}
              handleChange={(e) => setItemName(e.target.value)}
              placeholder={'Enter zone name'}
            />
              <Select 
                label="Controlled workplace"
                value={value || zona.workplace} 
                placeholder={value || 'Select or enter'} 
                selectList={workplaceList} 
                handleChange={(value) => comboboxHandler(value)}
              />
          <p className={styles.item__description}>Select one or more areas on the left.</p>
          <div className={styles.item__footer}>
            <IonButton onClick={currentZoneId === -1 ? () => setCurrentZoneId(-2) : () => deleteZone(currentZoneId)} color="danger">Delete</IonButton>
            <div className={styles.item__footer_control}>
              <IonButton onClick={() => setCurrentZoneId(-2)} type="reset" fill="outline">Cancel</IonButton>
              <IonButton onClick={saveZone} type="submit">Save</IonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
