import moment from 'moment';
import { useState } from 'react';
import { Slider } from './swiper';
import { ViolintationFalse, ViolintationTrue } from '../../../../assets/svg/SVGcomponent.ts';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName.js';
import { selectCurrentReport } from '../../../../store/dataSlice';
import { useAppSelector } from '../../../../store/hooks';
import { ZoomOut } from '../../../../components/zoomOut';
import ImageSlider from '../../../../components/slider/slider';

export const CurrentReport = () => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const [fullImage, setFullImage] = useState(false);
  return (
    <>
      {currentReport && (
        <>
          <div className="dashboard__report">
            <div className="dashboard__report_image">
              {currentReport && <ImageSlider images={currentReport.photos} />}
            </div>
            <div className="dashboard__report_item">
              <span className="dashboard_text">Date & Time</span>
              <span className="dashboard_text2">
                {moment
                  .utc(currentReport.start_tracking)
                  .utcOffset(moment().utcOffset())
                  .format('YYYY-MM-DD ')}
                |
                {moment
                  .utc(currentReport.start_tracking)
                  .utcOffset(moment().utcOffset())
                  .format('HH:mm:ss')}
                -
                {moment
                  .utc(currentReport.stop_tracking)
                  .utcOffset(moment().utcOffset())
                  .format('HH:mm:ss')}
              </span>
            </div>
            <div className="dashboard__report_item">
              <span className="dashboard_text">Camera</span>
              <span className="dashboard_text2">{currentReport.camera.name}</span>
            </div>
            <div className="dashboard__report_item">
              <span className="dashboard_text">Algorithm</span>

              <span className="dashboard_text2">
                {parsingAlgorithmName(currentReport.algorithm.name)}
              </span>
            </div>
            <div className="dashboard__report_item">
              <span className="dashboard_text">Status</span>
              <span className="dashboard_text2">
                {currentReport.violation_found ? <ViolintationFalse /> : <ViolintationTrue />}
              </span>
            </div>
          </div>
        </>
      )}
      {fullImage && (
        <>
          <div className="dashboard__fullimage">
            <img src={fullImage} alt="report img" className="dashboard__fullimage_image" />
            <ZoomOut className={'dashboard__fullimage_out'} onClick={() => setFullImage(false)} />
          </div>
        </>
      )}
    </>
  );
};
