import { useEffect, useState } from 'react';
import { getAveilableAlgorithms } from '../../../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import { Input } from '../../../../components/input';

export const AlgorithmSelect = ({
  token,
  algorithmsActive,
  setInformationToSend,
  operationID,
  setOperationID,
}) => {
  const [algorithmList, setAlgorithmList] = useState(false);
  const [checkboxAlgo, setCheckboxAlgo] = useState(
    algorithmsActive ? Object.assign([], algorithmsActive) : []
  );

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token).then((res) => {
      if (res.data.length > 0) {
        let allAlgorithm = res.data.filter((alg) => alg.is_available);
        console.log(allAlgorithm);
        setAlgorithmList(allAlgorithm);
      }
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
  console.log(algorithmList);
  return (
    <div className="cameras__settings_algorithms">
      <h1 className="cameras__settings_algorithms_title">
        {algorithmsActive ? algorithmsActive.length : 0}/{algorithmList ? algorithmList.length : 0}{' '}
        <span>algorithms used</span>
      </h1>
      <div className="cameras__settings_algorithms_list">
        {algorithmList &&
          algorithmList.length > 0 &&
          algorithmList.map((algorithm, index) => (
            <div className="cameras__settings_algorithms_container" key={index}>
              <label className="cameras__settings_algorithms_list_item">
                {parsingAlgorithmName(algorithm.name)}
                <input
                  type="checkbox"
                  defaultChecked={algorithmsActive && algorithmsActive.includes(algorithm.name)}
                  onChange={() => checkboxHandler(algorithm.name)}
                  className={'checkbox'}
                />
              </label>
              <span className="cameras__settings_algorithms_list_item_desc">
                {algorithm.description}
              </span>
              {parsingAlgorithmName(algorithm.name) === 'Operation control' && (
                <>
                  <h2>Controlled operation</h2>
                  <Input
                    className={'cameras__settings_algorithms_container_input'}
                    placeholder={'Enter ID'}
                    value={operationID}
                    onChange={(e) => setOperationID(e.target.value.replace(/[^\d]/g, ''))}
                  />
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
