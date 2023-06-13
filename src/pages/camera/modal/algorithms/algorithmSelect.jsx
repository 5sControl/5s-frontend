import { useEffect, useState } from 'react';
import { getAveilableAlgorithms } from '../../../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import { Input } from '../../../../components/input';
import { RightSection } from '../rightSection/right';
import { getAlgorithmZones, getCameraZones } from '../../../../api/cameraRequest';

import styles from './algorithms.module.scss';
import { useCookies } from 'react-cookie';
export const AlgorithmSelect = ({
  token,
  algorithmsActive,
  setInformationToSend,
  operationID,
  setOperationID,
  isCreateCamera,
  cameraSelect,
  cameraIP,
  userName,
  password,
  setConfigAlgo,
}) => {
  const [algorithmList, setAlgorithmList] = useState(false);
  const [algoWorkzone, setAlgoWorkzone] = useState({});
  const [checkboxAlgo, setCheckboxAlgo] = useState(
    algorithmsActive ? Object.assign([], algorithmsActive) : []
  );
  const [cookie] = useCookies(['token']);
  const [workplace, setWorkplace] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token)
      .then((res) => {
        if (res.data.length > 0) {
          let allAlgorithm = res.data.filter((alg) => alg.is_available);
          setAlgorithmList(allAlgorithm);
          const obj = allAlgorithm.reduce((newObj, item) => {
            newObj[item.name] = [];
            return newObj;
          }, {});
          setLoaded(!loaded);
          setAlgoWorkzone({ ...obj });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    getCameraZones(window.location.hostname, cookie.token, cameraSelect.id)
      .then((res) => {
        setWorkplace(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(algoWorkzone);
  useEffect(() => {
    if (loaded) {
      const algoObj = algoWorkzone;

      getAlgorithmZones(window.location.hostname, cookie.token, cameraSelect.id).then((res) => {
        console.log(res.data);
        const result = res.data.algorithms;
        if (Object.keys(result).length > 0) {
          Object.keys(result).forEach((el) => {
            algoObj[el] = result[el];
          });
          setAlgoWorkzone({ ...algoObj });
        }
      });
    }
  }, [loaded]);

  useEffect(() => {
    setInformationToSend(checkboxAlgo);
  }, [checkboxAlgo]);

  const checkboxHandler = (state) => {
    if (checkboxAlgo.includes(state)) {
      setCheckboxAlgo(checkboxAlgo.filter((item) => item !== state));
    } else {
      setCheckboxAlgo([...checkboxAlgo, state]);
    }
  };

  const workPlaceHandler = (id, algorithm) => {
    const sendList = algoWorkzone;
    if (id < 0) {
      sendList[algorithm] = [];
    } else {
      if (sendList[algorithm].includes(id)) {
        console.log(id);
        const index = sendList[algorithm].indexOf(id);
        sendList[algorithm].splice(index, 1);
      } else {
        sendList[algorithm].push(id);
      }
    }
    setAlgoWorkzone({ ...sendList });
  };
  useEffect(() => {
    setConfigAlgo(algoWorkzone);
  }, [algoWorkzone]);

  return (
    <div className="cameras__settings_container">
      <div className={styles.wrapper}>
        <div className={styles.algorithms}>
          <h1 className={styles.algorithms_title}>
            {algorithmsActive ? algorithmsActive.length : 0}/
            {algorithmList ? algorithmList.length : 0} <span>algorithms used</span>
          </h1>
          <div className={styles.algorithms_list}>
            {algorithmList &&
              algorithmList.length > 0 &&
              algorithmList.map((algorithm, index) => (
                <div className={styles.algorithms_container} key={index}>
                  <label className={styles.algorithms_list_item}>
                    {parsingAlgorithmName(algorithm.name)}
                    <input
                      type="checkbox"
                      defaultChecked={algorithmsActive && algorithmsActive.includes(algorithm.name)}
                      onChange={() => checkboxHandler(algorithm.name)}
                      className={styles.checkbox}
                    />
                  </label>
                  <span className={styles.algorithms_list_item_desc}>{algorithm.description}</span>
                  {parsingAlgorithmName(algorithm.name) === 'Operation control' && (
                    <>
                      <h2>Controlled operation</h2>
                      <Input
                        className={styles.algorithms_container_input}
                        placeholder={'Enter ID'}
                        value={operationID}
                        onChange={(e) => setOperationID(e.target.value.replace(/[^\d]/g, ''))}
                      />
                    </>
                  )}
                  <div className={styles.workplace}>
                    <span
                      className={
                        algoWorkzone[algorithm.name].length > 0 ? styles.noSelect : styles.select
                      }
                      onClick={() => workPlaceHandler(-1, algorithm.name)}
                    >
                      Camera
                    </span>
                    {workplace.length > 0 &&
                      algoWorkzone &&
                      workplace.map((el) => (
                        <span
                          key={el.id}
                          className={
                            algoWorkzone[algorithm.name].includes(el.id)
                              ? styles.select
                              : styles.noSelect
                          }
                          onClick={() => workPlaceHandler(el.id, algorithm.name)}
                        >
                          {el.name}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <RightSection
        isCreateCamera={isCreateCamera}
        cameraSelect={cameraSelect}
        cameraIP={cameraIP}
        userName={userName}
        password={password}
      />
    </div>
  );
};
