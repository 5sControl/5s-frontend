/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { ReportListItem } from "./ReportListItem";
import { CurrentReport } from "./currentReport";

export const Reports = ({ data, paginator }) => {

  return (
    <>
      <div className="dashboard__container">
        <div className="dashboard__choose">
          {/* {data && <Paginator 
                    data={data}
                    setCurrentPage={e=>setCurrentPage(e)}
                    currentPage={currentPage}
                />} */}

          <div className="dashboard__reports">
            {data &&
              data.map((el, ind) => {
                return (
                  <ReportListItem
                    key={ind}
                    item={el}
                  />
                );
              })}
          </div>
        </div>
          <CurrentReport
            actionReport={window.location.pathname}
          />
      </div>
    </>
  );
};
