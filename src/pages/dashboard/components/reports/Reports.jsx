import { ReportListItem } from './ReportListItem';
import { CurrentReport } from './currentReport';

import styles from './reports.module.scss';

export const Reports = ({ data }) => {
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
