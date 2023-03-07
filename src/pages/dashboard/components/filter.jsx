import { useState, useEffect } from 'react';

import { SelectTimeDiapason } from '../../../components/selectTimeDiapason';
import { DataPicker } from '../../../components/dataPicker';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName';

import { getProcess } from '../../../api/algorithmRequest';
export const FilterForm = ({
  cookies,
  setCameraToResponse,
  update,
  cameraToResponse,
  endTime,
  setEndTime,
  algorithmToResponse,
  setAlgorithmToResponse,
  selectDate,
  setSelectDate,
  startTime,
  setStartTime,
  selectCameras,
}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalDate, setVisibleModalDate] = useState(false);

  const [selectAlgorithm, setSelectAlgorithm] = useState([]);

  useEffect(() => {
    getProcess(window.location.hostname, cookies.token).then((e) => {
      if (e.data) {
        let bufAlg = e.data;
        bufAlg = bufAlg?.map((el) => el.algorithm.name);
        setSelectAlgorithm([...new Set(bufAlg)]);
      }
    });
  }, []);

  return (
    <div className="dashboard__title">
      <h1>Dashboard</h1>
      <div className="dashboard__title__filter">
        <select
          value={cameraToResponse}
          onChange={(e) => setCameraToResponse(e.target.value)}
          className="dashboard__title_button"
        >
          <option value="camera">Select cameras</option>
          {selectCameras.map((el, ind) => {
            return (
              <option value={el.id} key={ind}>
                {el.name}
              </option>
            );
          })}
        </select>
        <select
          value={algorithmToResponse}
          onChange={(e) => setAlgorithmToResponse(e.target.value)}
          className="dashboard__title_button"
        >
          <option value="algorithm">Select algorithm</option>
          {selectAlgorithm.map((el, ind) => {
            return (
              <option value={el} key={ind}>
                {parsingAlgorithmName(el)}
              </option>
            );
          })}
        </select>
        <span className="dashboard__title_button">Sort: Newest</span>
        <button onClick={() => setVisibleModal(!visibleModal)} className="dashboard__title_button">
          {`${startTime.split(':').slice(0, 2).join(':')} - ${endTime
            .split(':')
            .slice(0, 2)
            .join(':')}`}
        </button>
        <button
          onClick={() => setVisibleModalDate(!visibleModalDate)}
          className="dashboard__title_button"
        >
          {`${selectDate}`}
        </button>
      </div>

      {visibleModalDate && (
        <div className="dashboard__datapicker">
          <DataPicker
            setSelectDate={(e) => setSelectDate(e)}
            update={update}
            setVisibleModalDate={(e) => setVisibleModalDate(e)}
            selectDateDash={selectDate}
          />
        </div>
      )}

      {visibleModal && (
        <SelectTimeDiapason
          startTime={startTime}
          setStartTime={(e) => setStartTime(e)}
          endTime={endTime}
          setEndTime={(e) => setEndTime(e)}
          update={update}
          setVisibleModal={(e) => setVisibleModal(e)}
        />
      )}
    </div>
  );
};
