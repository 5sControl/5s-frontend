/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { ReportListItem } from "./ReportListItem";
import { CurrentReport } from "./currentReport";

export const Reports = ({ data, paginator, currentReportMain }) => {
  const [fullImage, setFullImage] = useState(false);
  const [currentReport, setCurrentReport] = useState(false);

  useEffect(() => {
    if (data && currentReportMain){
      setCurrentReport(data.filter(data => data.id === currentReportMain)[0])
    }
    
  },[currentReportMain])

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
                    setCurrentReport={(el) => setCurrentReport(el)}
                    currentReport={currentReport}
                  />
                );
              })}
          </div>
        </div>

        {currentReport && (
          <CurrentReport
            currentReport={currentReport}
            setFullImage={(el) => setFullImage(el)}
            actionReport={window.location.pathname}
          />
        )}
      </div>
      {fullImage && (
        <>
          <div
            className="dashboard__fullimage"
            onClick={() => setFullImage(false)}
          >
            <img
              src={fullImage}
              alt="report img"
              className="dashboard__fullimage_image"
            />
          </div>
        </>
      )}
    </>
  );
};
