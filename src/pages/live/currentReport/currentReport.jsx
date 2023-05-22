import { useState } from 'react';
import moment from 'moment';

import { Slider } from './swiper';
import { ViolintationFalse, ViolintationTrue } from '../../../assets/svg/SVGcomponent.ts';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName.js';
import { selectCurrentReport } from '../../../store/dataSlice';
import { useAppSelector } from '../../../store/hooks';

import './current-report.scss';
import ImageSlider from '../../../components/slider/slider';
export const CurrentReport = ({ camera }) => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const [fullImage, setFullImage] = useState(false);

  return (
    <>
      {currentReport ? (
        <>
          <div className="current-report">
            <div className="current-report__image">
              {currentReport && <ImageSlider images={currentReport.photos} />}
            </div>
            <div className="current-report__description">
              <span>
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

              <div className="current-report_item">
                <span>{currentReport.camera.name}</span>
              </div>
              <div className="current-report_item">
                <span>{parsingAlgorithmName(currentReport.algorithm.name)}</span>
              </div>
              <div className="current-report_item">
                <span>
                  {currentReport.violation_found ? <ViolintationFalse /> : <ViolintationTrue />}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {camera !== 'camera' && (
            <div className="current-report">
              <video
                id="videoPlayer"
                src={`http://${window.location.hostname}:3456/stream?camera_ip=${camera}`}
                controls
                autoPlay
              ></video>
            </div>
          )}
        </>
      )}
      {fullImage && (
        <>
          <div className="current-report__fullimage" onClick={() => setFullImage(false)}>
            <img src={fullImage} alt="report img" className="current-report__fullimage_image" />
          </div>
        </>
      )}
    </>
  );
};
