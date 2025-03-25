import { ArrowDown } from "../../../../assets/svg/SVGcomponent";
import { Input } from "../../../inputs/input/Input";
import styles from "../zones.module.scss";
import { useEffect, useState } from "react";
import DynamicSelectInput from "../../../selects/select/Select";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const comboboxHandler = value => {
    if (value?.detail) {
      setValue(value.detail.value);
      setWorkplaceToSend(workplaceList.filter(item => item.value === value.detail.value)[0]);
    } else {
      setValue(value);
      setWorkplaceToSend(workplaceList.filter(item => item.value === value)[0]);
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
      setItemName(`${t("camera.zone")} ${numberOfZones + 1}`);
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
          <span className={styles.zona__name}>
            {t("camera.name")}: {name}
          </span>
          <span className={styles.zona__workplace}>
            {t("camera.workplace")}: {workplace?.operationName || zona.workplace}
          </span>
        </div>
        <span className={styles.zona__right} onClick={showHandler}>
          <img src={ArrowDown} className={isShow && currentZoneId === zona.id ? styles.rotate : ""} />
        </span>
      </div>

      {isShow && currentZoneId === zona.id && (
        <div className={styles.item__edit}>
          <Input
            label={t("camera.name")}
            required
            value={itemName}
            handleChange={e => setItemName(e.target.value)}
            placeholder={t("camera.zoneSegment.namePlaceholder")}
            maxLength={30}
          />
          <DynamicSelectInput
            label={t("camera.workplace")}
            value={value || zona.workplace}
            placeholder={value || t("camera.zoneSegment.select")}
            selectList={workplaceList}
            handleChange={value => comboboxHandler(value)}
          />
          <p className={styles.item__description}>{t("camera.zoneSegment.selectAreas")}</p>
          <div className={styles.item__footer}>
            <IonButton
              size="small"
              onClick={currentZoneId === -1 ? () => setCurrentZoneId(-2) : () => deleteZone(currentZoneId)}
              color="danger"
            >
              {t("operations.delete")}
            </IonButton>
            <div className={styles.item__footer_control}>
              <IonButton size="small" onClick={() => setCurrentZoneId(-2)} type="reset" fill="outline">
                {t("operations.cancel")}
              </IonButton>
              <IonButton size="small" onClick={saveZone} type="submit">
                {t("operations.save")}
              </IonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
