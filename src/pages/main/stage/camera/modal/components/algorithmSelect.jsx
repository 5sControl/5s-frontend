import { useEffect, useState } from 'react';
import { getAveilableAlgorithms } from '../../../../../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../../../../../functions/parsingAlgorithmName';

export const AlgorithmSelect = ({ token, algorithmsActiveObject }) => {
  const [algorithmList, setAlgorithmList] = useState({});
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithmsActiveObject);

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token).then((res) => {
      let allAlgorithm = Object.keys(res.data).filter((key) => res.data[key]);
      setAlgorithmList(allAlgorithm);
    });
  }, []);

  const checkboxHandler = (state) => {
    if (!selectedAlgorithm.includes(state)) {
      setSelectedAlgorithm([...selectedAlgorithm, state]);
    } else {
      setSelectedAlgorithm(selectedAlgorithm.filter((item) => item !== state));
    }
  };

  return (
    <div className="cameras__settings_algorithms">
      <h1 className="cameras__settings_algorithms_title">
        {selectedAlgorithm.length}/{algorithmList.length} <span>algorithms used</span>
      </h1>
      <div className="cameras__settings_algorithms_list">
        {algorithmList.length > 0 &&
          algorithmList.map((algorithm, index) => (
            <div key={index} className="cameras__settings_algorithms_list_item">
              <span>{parsingAlgorithmName(algorithm)}</span>
              <input
                type="checkbox"
                defaultChecked={selectedAlgorithm && selectedAlgorithm.includes(algorithm)}
                onChange={() => checkboxHandler(algorithm)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
