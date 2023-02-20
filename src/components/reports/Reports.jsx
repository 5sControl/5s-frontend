/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { Paginator } from "./Paginator";
import { ReportListItem } from "./ReportListItem";
import { CurrentReport } from "./currentReport";

export const Reports = ({data, paginator}) =>{
    const [fullImage, setFullImage] = useState(false)
    const [currentReport, setCurrentReport] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    
    useEffect(()=>{
        paginator(currentPage)
    },[currentPage])

    return (
        <>

        <div className='dashboard__container'>
              <div className='dashboard__choose'>
                <div className='dashboard__tabs'>
                  <span>Date</span>
                  <span>Status</span>
                  <span>Camera</span>
                  <span>Algorithm</span>
                  <span>Sort: Newest</span>
                </div>
               {data && <Paginator 
                    data={data}
                    setCurrentPage={e=>setCurrentPage(e)}
                    currentPage={currentPage}
                />}
               
                <div className='dashboard__reports'>
                  {data && data.results.map((el, ind)=>{
                    return (
                      <ReportListItem 
                          key={ind}
                          item = {el} 
                          setCurrentReport = {el => setCurrentReport(el)}
                          currentReport = {currentReport}
                      />
                    )
                  })}
                </div>
              </div>

              {currentReport &&
                <CurrentReport
                  currentReport = {currentReport}
                  setFullImage = {el => setFullImage(el)}
                  actionReport = {window.location.pathname}
                />
              }
             
        </div>
        {
            fullImage &&
            <>
                <div className='dashboard__fullimage' onClick={()=>setFullImage(false)}>
                <img 
                    src={fullImage} 
                    alt='report img' 
                    className='dashboard__fullimage_image'
                    />
                </div>
            </>
     }
        </>
    )
}