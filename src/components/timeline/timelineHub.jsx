/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Timeline } from "./timeline";
import { calculateTimeCenter } from "../../functions/calculateTimeCenter";
import "./timeline";
import { useEffect } from "react";
import { getProcess } from "../../api/requests";
import { useCookies } from "react-cookie";
export const TimelineHub = ({
  data,
  startDate,
  endDate,
  startTime,
  endTime,
}) => {
  const algorithm = data.reduce((prev, curr) => {
    return [...new Set([...prev, curr.algorithm.name])];
  }, []);
  
  const cameras = data.reduce((prev, curr) => {
    return [...new Set([...prev, curr.camera.name])];
  }, []);

  return (
    <div className="timeline-hub">
      {/* <div className="timeline__description">
        <ul>
          <li className="green-li">
            <span>Supervised</span>
          </li>
          <li className="red-li">
            <span>Unsupervised</span>
          </li>
        </ul>
      </div> */}
      {cameras.map((el, id) => {
        return (
          <div key={id} className="timeline-hub__container">
            <h1>{el}</h1>
            {algorithm.map((algorithm, id) => {
              return (
                <div className="timeline-hub__camera" key={id}>
                  <Timeline
                    data={data
                      .filter((e) => e.camera.name === el)
                      .filter((cam) => cam.algorithm.name === algorithm)}
                    startDate={startDate}
                    endDate={endDate}
                    algorithm={algorithm}
                    startTime={startTime}
                    endTime={endTime}
                  />
                </div>
              );
            })}
              <div className="timeline__line">
                <span>{startTime.split(':').slice(0,2).join(':')}</span>
                {
                  calculateTimeCenter(endTime, startTime).map((el, id) => 
                    <span key={id}>{el.split(':').slice(0,2).join(':')}</span>
                  )
                }
                <span>{endTime.split(':').slice(0,2).join(':')}</span>
              </div>
          </div>
        );
      })}
    </div>
  );
};
