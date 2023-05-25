import moment from 'moment';
import { useState, useEffect } from 'react';
import { ViolintationFalse, ViolintationTrue } from '../../../../assets/svg/SVGcomponent.ts';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName.js';
import { selectCurrentReport } from '../../../../store/dataSlice';
import { useAppSelector } from '../../../../store/hooks';
import { ZoomOut } from '../../../../components/zoomOut';
import ImageSlider from '../../../../components/slider/slider';
import { Scale } from '../../../../components/scale';
import { Modal } from '../../../../components/modal';

export const CurrentReport = () => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const [fullImage, setFullImage] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);

  console.log(currentReport);
  useEffect(() => {
    setCurrentCount(0);
  }, [currentReport]);

  return (
    <>
      {currentReport && (
        <>
          <div className="dashboard__report">
            <div className="dashboard__report_image">
              {currentReport && (
                <ImageSlider
                  images={currentReport.photos}
                  setCurrentCount={(num) => setCurrentCount(num)}
                  currentCount={currentCount}
                />
              )}
              <Scale onClick={() => setFullImage(true)} className="dashboard__report_scale" />
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
              <span className="dashboard_text2">
                {currentReport.camera ? currentReport.camera.name : 'Deleted Camera'}
              </span>
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
          <Modal
            isOpen={true}
            handleClose={() => setFullImage(false)}
            className="dashboard__fullimage"
          >
            <div className="dashboard__fullimage__container">
              <ImageSlider
                images={currentReport.photos}
                setCurrentCount={(num) => setCurrentCount(num)}
                currentCount={currentCount}
              />
              <ZoomOut
                className={'dashboard__fullimage__scale'}
                onClick={() => setFullImage(false)}
              />
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
