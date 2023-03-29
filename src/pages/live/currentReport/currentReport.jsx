import moment from 'moment';
import { useState } from 'react';
import { Slider } from './swiper';
import { ViolintationFalse, ViolintationTrue } from '../../../assets/svg/SVGcomponent.ts';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName.js';
import { selectCurrentReport } from '../../../store/dataSlice';
import { useAppSelector } from '../../../store/hooks';
import './current-report.scss';
export const CurrentReport = () => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const [fullImage, setFullImage] = useState(false);

  return (
    <>
      {currentReport && (
        <>
          <div className="current-report">
            <div className="current-report__image">
              {currentReport && (
                <Slider currentReport={currentReport} setFullImage={(e) => setFullImage(e)} />
              )}
            </div>
            <div className="current-report__description">
              <span>
                {moment(currentReport.start_tracking).add(3, 'hours').format('YYYY-MM-DD ')}|
                {moment(currentReport.start_tracking).add(3, 'hours').format('HH:mm:ss')}-
                {moment(currentReport.stop_tracking).add(3, 'hours').format('HH:mm:ss')}
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
