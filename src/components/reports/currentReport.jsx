import moment from "moment";
import { useState } from "react";

import { Slider } from "../swiper.js";
import {
  ViolintationFalse,
  ViolintationTrue,
} from "../../assets/svg/SVGcomponent.js";

import { useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { parsingAlgorithmName } from "../../functions/parsingAlgorithmName.js";

export const CurrentReport = () => {
  const currentReport = useSelector((state) => state.currentReport.report);
  const [fullImage, setFullImage] = useState(false);
  return (
    <>
      {currentReport && (
        <>
          <div className="dashboard__report">
            <div className="dashboard__report_image">
              {
                currentReport && 
                <Slider
                  currentReport={currentReport}
                  setFullImage={(e) => setFullImage(e)}
                />
              }
             
            </div>

            <div className="dashboard__report_item">
              <span>Date & Time</span>
              <span>
                {moment(currentReport.start_tracking)
                  .add(3, "hours")
                  .format("YYYY-MM-DD ")}
                |
                {moment(currentReport.start_tracking)
                  .add(3, "hours")
                  .format("HH:mm:ss")}
                -
                {moment(currentReport.stop_tracking)
                  .add(3, "hours")
                  .format("HH:mm:ss")}
              </span>
            </div>
            <div className="dashboard__report_item">
              <span>Camera</span>
              <span>{currentReport.camera.name}</span>
            </div>
            <div className="dashboard__report_item">
              <span>Algorithm</span>

              <span>{parsingAlgorithmName(currentReport.algorithm.name)}</span>
            </div>
            <div className="dashboard__report_item">
              <span>Status</span>
              <span>
                {currentReport.violation_found ? (
                  <ViolintationFalse />
                ) : (
                  <ViolintationTrue />
                )}
              </span>
            </div>
          </div>
        </>
      )}
            {fullImage && (
        <>
          <div
            className="dashboard__fullimage"
            onClick={() => setFullImage(false)}
          >
            <img
              src={fullImage}
              alt="report img"
              className="dashboard__fullimage_image"
            />
          </div>
        </>
      )}
    </>
  );
};
