import { useEffect, useState } from 'react';
import { getAveilableAlgorithms } from '../../../../../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../../../../../functions/parsingAlgorithmName';

export const AlgorithmSelect = ({ token, algorithmsActive, process, IPCamera }) => {
  const [algorithmList, setAlgorithmList] = useState(false);
  let checkboxAlgo = algorithmsActive ? Object.assign([], algorithmsActive) : [];
  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token).then((res) => {
      let allAlgorithm = Object.keys(res.data).filter((key) => res.data[key]);
      setAlgorithmList(allAlgorithm);
    });
  }, []);

  const checkboxHandler = (state) => {
    if (checkboxAlgo.includes(state)) {
      checkboxAlgo = checkboxAlgo.filter((item) => item !== state);
    } else {
      checkboxAlgo.push(state);
    }
    let willDelete = algorithmsActive
      ? algorithmsActive.filter((el) => !checkboxAlgo.includes(el))
      : [];

    let sendDelete = process.filter((element) => {
      return element.camera.id === IPCamera && willDelete.includes(element.algorithm.name);
    });

    const changedAfterSelect = {
      delete: sendDelete.map((el) => el.process_id),
      add: checkboxAlgo.filter((el) => !algorithmsActive.includes(el)),
    };
    console.log(changedAfterSelect);
  };

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
            <div key={index} className="cameras__settings_algorithms_list_item">
              <span>{parsingAlgorithmName(algorithm)}</span>
              <input
                type="checkbox"
                defaultChecked={algorithmsActive && algorithmsActive.includes(algorithm)}
                onChange={() => checkboxHandler(algorithm)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
