import { ReportListItem } from './ReportListItem';
import { CurrentReport } from './currentReport';

export const Reports = ({ data }) => {
  return (
    <>
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
