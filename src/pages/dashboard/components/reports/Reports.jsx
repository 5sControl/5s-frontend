import { ReportListItem } from './ReportListItem';
import { CurrentReport } from './currentReport';

export const Reports = ({ data }) => {
  return (
    <>
      <h3 className="dashboard__h3">
        Reports <span>{data.length}</span>
      </h3>
      <div className="dashboard__container">
        <div className="dashboard__choose">
          <div className="dashboard__reports">
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
