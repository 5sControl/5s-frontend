import { useEffect } from 'react';
import { ReportListItem } from './ReportListItem';
import { CurrentReport } from './currentReport';
import { addCurrentReport, selectCurrentReport } from '../../../../store/dataSlice';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import styles from './reports.module.scss';

export const Reports = ({ data }) => {
  const { currentReport } = useAppSelector(selectCurrentReport);
  const dispatch = useAppDispatch();

  const goToNextReport = (e) => {
    if (e === 'ArrowDown' && currentReport && data.indexOf(currentReport) !== data.length - 1) {
      dispatch(addCurrentReport(data[data.indexOf(currentReport) + 1]));
    }
    if (e === 'ArrowUp' && currentReport && data.indexOf(currentReport) > 0) {
      dispatch(addCurrentReport(data[data.indexOf(currentReport) - 1]));
    }
  };

  useEffect(() => {
    const nextItem = (e) => (e.key ? goToNextReport(e.key) : null);
    document.body.addEventListener('keydown', nextItem);
    return () => {
      document.body.removeEventListener('keydown', nextItem);
    };
  }, [currentReport]);

  return (
    <>
      <h3 className={styles.title}>
        Reports <span>{data.length}</span>
      </h3>
      <div className={styles.container}>
        <div className={styles.choose}>
          <div className={styles.reports}>
            {data &&
              data.map((el, ind) => {
                return <ReportListItem key={ind} item={el} />;
              })}
          </div>
        </div>
        <CurrentReport />
      </div>
    </>
  );
};
