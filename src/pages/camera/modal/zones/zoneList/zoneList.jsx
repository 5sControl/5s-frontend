import { useEffect, useState } from "react";
import styles from "../zones.module.scss";
import { Item } from "./zoneItem";

export const ZoneList = ({
  saveZone,
  deleteZone,
  cameraZones,
  setItemName,
  itemName,
  setCurrentZoneId,
  currentZoneId,
  setWorkplaceToSend,
  workplaceList,
  workplace,
  isNewZone,
  setIsNewZone,
}) => {
  const [isBlockAdd, setIsBlockAdd] = useState(false);
  const [workplaces, setWrokplaces] = useState([]);

  const addZoneHandler = () => {
    setCurrentZoneId(-1);
    setIsBlockAdd(true);
    setIsNewZone(true);
  };

  useEffect(() => {
    if (currentZoneId !== -1) {
      setIsNewZone(false);
      setIsBlockAdd(false);
    }
    const workplaces = cameraZones.map(zone => zone.workplace);
    const filteredWorkplaces = workplaceList.filter(workplace => !workplaces.includes(workplace.operationName));
    setWrokplaces(filteredWorkplaces);
  }, [currentZoneId]);
  return (
    <>
      <div className={styles.zones__header}>
        <span> Zones</span>
        <span className={`${isBlockAdd ? styles.added : styles.add}`} onClick={addZoneHandler}>
          + Add Zone
        </span>
      </div>

      <div className={styles.list}>
        {[...cameraZones]
          .sort((a, b) => {
            const isNumberA = /^\d+/.test(a.name);
            const isNumberB = /^\d+/.test(b.name);

            if (isNumberA && isNumberB) return Number(a.name) - Number(b.name);

            return a.name.localeCompare(b.name, {sensitivity: "case"});
          })
          .map((zona, index) => (
            <Item
              key={index}
              workplaceList={workplaces}
              saveZone={saveZone}
              deleteZone={deleteZone}
              name={zona.name}
              workplace={
                zona.workplace && workplaceList.length > 0
                  ? workplaceList.filter(item => item.operationName === zona.workplace)[0]
                  : ""
              }
              setItemName={name => setItemName(name)}
              itemName={itemName}
              setCurrentZoneId={id => setCurrentZoneId(id)}
              zona={zona}
              currentZoneId={currentZoneId}
              setWorkplaceToSend={e => setWorkplaceToSend(e)}
              workplaceComboBox={workplace}
            />
          ))}
        {isNewZone && currentZoneId === -1 && (
          <Item
            workplaceList={workplaces}
            saveZone={saveZone}
            deleteZone={deleteZone}
            name={""}
            workplace={""}
            setItemName={name => setItemName(name)}
            itemName={itemName}
            isOpen={true}
            setCurrentZoneId={id => setCurrentZoneId(id)}
            zona={{ id: -1 }}
            currentZoneId={currentZoneId}
            setWorkplaceToSend={e => setWorkplaceToSend(e)}
            numberOfZones={cameraZones.length}
          />
        )}
      </div>
    </>
  );
};
