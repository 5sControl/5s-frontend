import { useEffect, useState } from 'react';
import { getAveilableAlgorithms } from '../../../../../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../../../../../functions/parsingAlgorithmName';

export const AlgorithmSelect = ({ token, algorithmsActiveObject }) => {
  const [algorithmList, setAlgorithmList] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    algorithmsActiveObject ? algorithmsActiveObject : []
  );

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token).then((res) => {
      let allAlgorithm = Object.keys(res.data).filter((key) => res.data[key]);
      setAlgorithmList(allAlgorithm);
    });
  }, []);

  const checkboxHandler = (state) => {
    let checkboxAlgo = [];
    if (!selectedAlgorithm.includes(state)) {
      checkboxAlgo.push(state);
    } else {
      checkboxAlgo = checkboxAlgo.filter((item) => item !== state);
    }
    console.log(checkboxAlgo);
  };

  return (
    <div className="cameras__settings_algorithms">
      <h1 className="cameras__settings_algorithms_title">
        {selectedAlgorithm ? selectedAlgorithm.length : 0}/
        {algorithmList ? algorithmList.length : 0} <span>algorithms used</span>
      </h1>
      <div className="cameras__settings_algorithms_list">
        {algorithmList &&
          algorithmList.length > 0 &&
          algorithmList.map((algorithm, index) => (
            <div key={index} className="cameras__settings_algorithms_list_item">
              <span>{parsingAlgorithmName(algorithm)}</span>
              <input
                type="checkbox"
                defaultChecked={selectedAlgorithm && selectedAlgorithm.includes(algorithm)}
                onChange={() => checkboxHandler(algorithm)}
                disabled={selectedAlgorithm && selectedAlgorithm.includes(algorithm)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
