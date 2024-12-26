import { useEffect, useState } from "react";
import styles from "./zones.module.scss";
import { ZonesCoordinates } from "./coordinates/zonesCoordinates";
import { ZoneList } from "./zoneList/zoneList";
import { getCameraZones, patchCameraZones, postCameraZones, deleteCameraZones } from "../../../../api/cameraRequest";
import { useCookies } from "react-cookie";
import { NoVideoBig } from "../../../../assets/svg/SVGcomponent";
import { getWorkplaceList } from "../../../../api/orderView";
import { Preloader } from "../../../../components/preloader";
import { Notification } from "../../../../components/notification/notification";
import Switch from "react-switch";

export const Zones = ({ cameraSelect, isCreateCamera }) => {
  const [coords, setCoords] = useState([]);
  const [itemName, setItemName] = useState("");
  const [isScale, setIsScale] = useState(false);
  const [cookie] = useCookies(["token"]);
  const [cameraZones, setCameraZones] = useState([]);
  const [currentZoneId, setCurrentZoneId] = useState();
  const [workplaceList, setWorkplaceList] = useState([]);
  const [workplaceToSend, setWorkplaceToSend] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [preloader, setPreloader] = useState(false);
  const [message, setMessage] = useState(false);
  const [createZoneMode, setCreateZoneMode] = useState(false);
  const [handleSaveError, setHandleSaveError] = useState(false);
  const [validZone, setValidZone] = useState(true);
  const [zoneType, setZoneType] = useState(2);

  const getRectanglePoints = coords => {
    if (Object.keys(coords).length < 8) {
      const { x1, y1, x2, y2 } = coords;

      return {
        x1: Math.min(x1, x2),
        y1: Math.min(y1, y2),
        x2: Math.max(x1, x2),
        y2: Math.min(y1, y2),
        x3: Math.max(x1, x2),
        y3: Math.max(y1, y2),
        x4: Math.min(x1, x2),
        y4: Math.max(y1, y2),
      };
    }

    return coords;
  };

  const orientation = (p, q, r) => {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    return val === 0 ? 0 : val > 0 ? 1 : 2;
  };

  const onSegment = (p, q, r) => {
    if (
      q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)
    )
      return true;
    return false;
  };

  const doLinesIntersect = (p1, q1, p2, q2) => {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    return (
      (o1 !== o2 && o3 !== o4) ||
      (o1 === 0 && onSegment(p1, p2, q1)) ||
      (o2 === 0 && onSegment(p1, q2, q1)) ||
      (o3 === 0 && onSegment(p2, p1, q2)) ||
      (o4 === 0 && onSegment(p2, q1, q2))
    );
  };

  const isPointInPolygon = (point, polygon) => {
    let x = point.x,
      y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i].x,
        yi = polygon[i].y;
      let xj = polygon[j].x,
        yj = polygon[j].y;
      let intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const pointsToArray = coords => {
    const newCoords = getRectanglePoints(coords);
    return [
      { x: newCoords.x1, y: newCoords.y1 },
      { x: newCoords.x2, y: newCoords.y2 },
      { x: newCoords.x3, y: newCoords.y3 },
      { x: newCoords.x4, y: newCoords.y4 },
    ];
  };

  const isOverlapping = (coords1, coords2) => {
    const polygon1 = pointsToArray(coords1);
    const polygon2 = pointsToArray(coords2);

    for (let i = 0; i < polygon1.length; i++) {
      if (isPointInPolygon(polygon1[i], polygon2)) {
        return true;
      }
    }
    for (let i = 0; i < polygon2.length; i++) {
      if (isPointInPolygon(polygon2[i], polygon1)) {
        return true;
      }
    }

    for (let i = 0, j = polygon1.length - 1; i < polygon1.length; j = i++) {
      for (let k = 0, l = polygon2.length - 1; k < polygon2.length; l = k++) {
        if (doLinesIntersect(polygon1[i], polygon1[j], polygon2[k], polygon2[l])) {
          return true;
        }
      }
    }

    return false;
  };

  const getZone = () => {
    setPreloader(true);
    getCameraZones(window.location.hostname, cookie.token, cameraSelect.id)
      .then(res => {
        setCameraZones(res.data);
        setCurrentZoneId(-2);
        setCoords([]);
        setPreloader(false);
      })
      .catch(err => {
        console.log(err);
        setPreloader(false);
      });
  };

  const deleteZone = id => {
    setPreloader(true);
    deleteCameraZones(window.location.hostname, cookie.token, id)
      .then(() => {
        setMessage({ status: true, message: "Zone was deleted" });
        getZone();
      })
      .catch(err => {
        console.log(err);
        setMessage({ status: false, message: "Zone was not deleted" });
        setPreloader(false);
      });
  };

  const saveZone = () => {
    const otherZones = cameraZones.filter(box => box.id !== currentZoneId);
    console.log("other Zones", otherZones);
    console.log("save coords", coords);

    if (coords.length === 0) {
      setMessage({ status: false, message: "Select zone" });
      return;
    }

    if (!validZone) {
      setMessage({ status: false, message: "Zone is not saved. Try again" });
      setHandleSaveError(prev => !prev);
      return;
    }

    const overlap = coords.some((figure, index) =>
      coords.slice(index + 1).some(otherFigure => isOverlapping(figure, otherFigure))
    );

    if (overlap) {
      setMessage({ status: false, message: "Zones must not overlap" });
      return;
    }

    for (const otherZone of otherZones) {
      for (const otherCoords of otherZone.coords) {
        const overlap = coords.some(coord => isOverlapping(coord, otherCoords));

        if (overlap) {
          setMessage({ status: false, message: "Zones must not overlap" });
          return;
        }
      }
    }

    const body = {
      coords: coords.map(coord => ({
        ...coord,
        zoneType: zoneType,
      })),
      camera: cameraSelect.id,
      name: itemName,
    };
    if (workplaceToSend) {
      body.index_workplace = workplaceToSend.id;
      body.workplace = workplaceToSend.operationName;
    }
    if (currentZoneId === -1) {
      setPreloader(true);
      postCameraZones(window.location.hostname, cookie.token, body)
        .then(() => {
          getZone();
          setMessage({ status: true, message: "Zone is saved" });
        })
        .catch(error => {
          console.log(error);
          setPreloader(false);
          setMessage({ status: false, message: "Zone is not saved" });
        });
    } else {
      setPreloader(true);
      patchCameraZones(window.location.hostname, cookie.token, body, currentZoneId)
        .then(() => {
          getZone();
          setMessage({ status: true, message: "Zone is saved" });
        })
        .catch(error => {
          console.log(error);
          setPreloader(false);
          setMessage({ status: false, message: "Zone is not saved" });
        });
    }
  };

  useEffect(() => {
    getZone();
    getWorkplaceList(window.location.hostname, cookie.token)
      .then(res => {
        setWorkplaceList(
          res.data.map(place => {
            return {
              ...place,
              comboBoxName: place.operationName,
              // comboBoxName: `${place.operationName} (id:${place.id})`,
            };
          })
        );
      })
      .catch(error => {
        console.log(error);
      });
  }, [updating]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(false);
      }, 2000);
    }
  }, [message]);

  useEffect(() => {
    const buf = cameraZones.filter(el => el.id === currentZoneId);
    if (buf.length > 0) {
      setItemName(buf[0].name);
      if (currentZoneId < 0) {
        setWorkplaceToSend(null);
      }
    }
  }, [currentZoneId]);

  return (
    <>
      {isCreateCamera ? (
        <section className={styles.creating}>
          <NoVideoBig />
          <p>Not connected to the camera. Check your connection in ‘Camera’ tab.</p>
        </section>
      ) : (
        <div className={styles.zones}>
          <ZonesCoordinates
            currentSelect={cameraSelect.id}
            setCoords={coords => setCoords(coords)}
            itemName={itemName}
            isScale={isScale}
            setIsScale={e => setIsScale(e)}
            cameraBox={cameraZones.filter(box => box.id !== currentZoneId)}
            oldBox={cameraZones.filter(box => box.id === currentZoneId)}
            currentZoneId={currentZoneId}
            createZoneMode={createZoneMode}
            handleSaveError={handleSaveError}
            setValidZone={setValidZone}
            isFourPointsMode={zoneType === 4}
          />
          <div className={styles.zones__right}>
            <ZoneList
              saveZone={saveZone}
              deleteZone={deleteZone}
              cameraZones={cameraZones}
              setItemName={name => setItemName(name)}
              itemName={itemName}
              setCurrentZoneId={id => setCurrentZoneId(id)}
              currentZoneId={currentZoneId}
              setWorkplaceToSend={e => setWorkplaceToSend(e)}
              workplaceList={workplaceList}
              workplace={workplaceToSend ? workplaceToSend.comboBoxName : ""}
              isNewZone={createZoneMode}
              setIsNewZone={setCreateZoneMode}
            />
            <div className={styles.zonesSwitcher}>
              <span>4 points zone mode</span>
              <Switch checked={zoneType === 4} onChange={e => setZoneType(e ? 4 : 2)} />
            </div>
          </div>
        </div>
      )}
      {preloader && (
        <div className={styles.preloader}>
          <Preloader />
        </div>
      )}
      {message && <Notification status={message.status} message={message.message} />}
    </>
  );
};
