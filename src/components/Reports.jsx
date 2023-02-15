/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Algorithm, Camera } from '../assets/svg/SVGcomponent';
import {  API_IMAGES,API_IMAGES_I } from '../api/api.js';
import { getIsInternet } from '../functions/getURL';

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
               {data && <>
                <div className='dashboard__paginator'>
                  <span>{`Reports per page: ${currentPage === Math.ceil(data.count / 20) ? data.count % 20 : 20}`}</span>
                    <div className='dashboard__paginator_container'>
                      <button 
                          className={currentPage === 1? 'dashboard__paginator_button_noactive': 'dashboard__paginator_button'} 
                          onClick={()=>setCurrentPage(currentPage - 1)}>
                        <AiOutlineLeft/>
                      </button>
                      <span className='dashboard__paginator_text'> {`${currentPage} of ${Math.ceil(data.count / 20)}`}</span>
                      <button 
                          className={currentPage === Math.ceil(data.count / 20)? 'dashboard__paginator_button_noactive': 'dashboard__paginator_button'}  
                          onClick={()=>setCurrentPage(currentPage + 1)}>
                        <AiOutlineRight/>
                      </button>
                    </div>
                  </div>
               </>}
               
                <div className='dashboard__reports'>
                  {data && data.results.map((el)=>{
                    return (
                      <div className='dashboard__reports_item' key={el.id} onClick={()=>setCurrentReport(el)}>
                        <div className={currentReport.id === el.id ? 'dashboard__reports_item_title active': 'dashboard__reports_item_title'}>{el.date_created}</div>
                        <div>{`# ${el.id}`}</div>
                        <div><Camera/> {el.camera}</div>
                        <div><Algorithm/> Safety control:{el.action}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {currentReport &&
                <div className='dashboard__report'>
                   <img 
                      src={getIsInternet(window.location.hostname) ? 
                        `${API_IMAGES_I + currentReport.image}` : 
                        `${API_IMAGES + currentReport.image}`} 
                        alt='report img' 
                        className='dashboard__report_image'
                        onClick={()=>setFullImage(true)}
                      />
                   <div className='dashboard__report_item'>
                    <span>Date & Time</span>
                    <span>{currentReport.date_created}</span>
                   </div>
                   <div className='dashboard__report_item'>
                    <span>Camera</span>
                    <span>{currentReport.camera}</span>
                   </div>
                   <div className='dashboard__report_item'>
                    <span>Algorithm</span>
                    <span>Safety control:{currentReport.action}</span>
                   </div>
                   <div className='dashboard__report_item'>
                    <span>Status</span>
                    <span>Not Checked</span>
                   </div>
                </div>
              }
             
        </div>
        {
            fullImage &&
            <>
                <div className='dashboard__fullimage' onClick={()=>setFullImage(false)}>
                <img 
                    src={getIsInternet(window.location.hostname) ? 
                    `${API_IMAGES_I + currentReport.image}` : 
                    `${API_IMAGES + currentReport.image}`} 
                    alt='report img' 
                    className='dashboard__fullimage_image'
                    />
                </div>
            </>
     }
        </>
    )
}