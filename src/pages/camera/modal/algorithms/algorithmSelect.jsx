import { useEffect, useState } from 'react';
import { getAveilableAlgorithms } from '../../../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import { Input } from '../../../../components/input';
import { RightSection } from '../rightSection/right';
import { getCameraZones } from '../../../../api/cameraRequest';

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
}) => {
  const [algorithmList, setAlgorithmList] = useState(false);
  const [checkboxAlgo, setCheckboxAlgo] = useState(
    algorithmsActive ? Object.assign([], algorithmsActive) : []
  );
  const [cookie] = useCookies(['token']);
  const [workplace, setWorkplace] = useState([]);
  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token)
      .then((res) => {
        if (res.data.length > 0) {
          let allAlgorithm = res.data.filter((alg) => alg.is_available);
          setAlgorithmList(allAlgorithm);
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
                    <span className={styles.select}> Camera</span>
                    {workplace.length > 0 &&
                      workplace.map((el) => (
                        <span key={el.id} className={styles.noSelect}>
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
