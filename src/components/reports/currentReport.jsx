
import moment from "moment";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Slider } from "../swiper.js";

export const CurrentReport = ({
  currentReport,
  setFullImage,
  actionReport,
}) => {
  return (
    <>
      <div className="dashboard__report">
        <div className="dashboard__report_image">
          <Slider 
            currentReport={currentReport}
            setFullImage = {(e) => setFullImage(e)}
          />
        </div>

        <div className="dashboard__report_item">
          <span>Date & Time</span>
          <span>
            {moment(new Date(currentReport.start_tracking)).add(3,'hours').format(
              "YYYY-MM-DD"
            )}{" "}
            |{" "}
            {moment(new Date(currentReport.start_tracking)).add(3,'hours').format("HH:mm:ss")}{" "}
            - {moment(new Date(currentReport.stop_tracking)).add(3,'hours').format("HH:mm:ss")}
          </span>
        </div>
        <div className="dashboard__report_item">
          <span>Camera</span>
          <span>{currentReport.camera.name}</span>
        </div>
        <div className="dashboard__report_item">
          <span>Algorithm</span>

          <span>{currentReport.algorithm.name}</span>
        </div>
        <div className="dashboard__report_item">
          <span>Status</span>
          <span>Not Checked</span>
        </div>
      </div>
    </>
  );
};
