import { useEffect, useState } from 'react';
import { getAveilableAlgorithms } from '../../../../../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../../../../../functions/parsingAlgorithmName';
export const AlgorithmSelect = ({ token }) => {
  const [algorithmList, setAlgorithmList] = useState({});

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token).then((res) => {
      let allAlgorithm = Object.keys(res.data).filter((key) => res.data[key]);
      setAlgorithmList(allAlgorithm);
      console.log(allAlgorithm);
    });
  }, []);
  return (
    <div className="cameras__settings_algorithms">
      <h1 className="cameras__settings_algorithms_title">
        0/{algorithmList.length} <span>algorithms used</span>
      </h1>
      <div className="cameras__settings_algorithms_list">
        {algorithmList.map((algorithm, index) => (
          <div key={index} className="cameras__settings_algorithms_list_item">
            <span>{parsingAlgorithmName(algorithm)}</span>
            <input type="checkbox" />
          </div>
        ))}
      </div>
    </div>
  );
};
