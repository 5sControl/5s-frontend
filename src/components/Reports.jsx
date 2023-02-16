/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Algorithm, Camera } from '../assets/svg/SVGcomponent';
import {  API_IMAGES,API_IMAGES_I } from '../api/api.js';
import { getIsInternet } from '../functions/getURL';
import {Navigation, Pagination} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import moment from 'moment';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
                       {  (window.location.pathname.includes('safety') || window.location.pathname.includes('dashboard'))&& <div className={currentReport.id === el.id ? 'dashboard__reports_item_title active': 'dashboard__reports_item_title'}>{el.date_created}</div>}
                       { (window.location.pathname.includes('idle') || window.location.pathname.includes('machine'))  && <div className={currentReport.id === el.id ? 'dashboard__reports_item_title active': 'dashboard__reports_item_title'}>{moment(new Date(el.start_tracking)).format('YYYY-MM-DD')} |  {moment(new Date(el.start_tracking)).format('HH:mm:ss') } - {moment(new Date(el.stop_tracking)).format('HH:mm:ss') }</div>}
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
                     { 
                     (window.location.pathname.includes('safety') || window.location.pathname.includes('dashboard')) && 
                     <div className='dashboard__report_image'>
                        <img 
                        src={getIsInternet(window.location.hostname) ? 
                            `${API_IMAGES_I + currentReport.image}` : 
                            `${API_IMAGES + currentReport.image}`} 
                            alt='report img' 
                            className='dashboard__report_image_src'
                            onClick={()=>setFullImage(getIsInternet(window.location.hostname) ? 
                                `${API_IMAGES_I + currentReport.image}` : 
                                `${API_IMAGES +  currentReport.image}`)}
                        />
                       </div>
                       }
                 
                    { 
                     window.location.pathname.includes('machine') && 
                     <div className='dashboard__report_image'>
                         <Swiper
                            className={'dashboard__report_image'}
                            modules={[Navigation, Pagination]}
                            navigation={true}
                            pagination={{type: 'fraction'}}
                            spaceBetween={50}
                            slidesPerView={1}
                            onSlideChange={(swiperCore) => {
                                const {activeIndex} = swiperCore;
                                console.log(activeIndex);
                            }}
                        >
                            {[currentReport.photo_start, currentReport.photo_stop].map((photo, id) =>
                                <SwiperSlide key={id}>
                                      <img 
                                        key={id}
                                        src={getIsInternet(window.location.hostname) ? 
                                        `${API_IMAGES_I + photo}` : 
                                        `${API_IMAGES +  photo}`} 
                                        alt='report img' 
                                        className='dashboard__report_image_src'
                                        onClick={()=>setFullImage(getIsInternet(window.location.hostname) ? 
                                            `${API_IMAGES_I + photo}` : 
                                            `${API_IMAGES +  photo}`)}
                                    />
                                </SwiperSlide>)}
                        </Swiper>
                    </div>
                       }

                    { 
                     window.location.pathname.includes('idle') && 
                     <div className='dashboard__report_image'>
                         <Swiper
                            className={'dashboard__report_image'}
                            modules={[Navigation, Pagination]}
                            navigation={true}
                            pagination={{type: 'fraction'}}
                            spaceBetween={50}
                            slidesPerView={1}
                            onSlideChange={(swiperCore) => {
                                const {activeIndex} = swiperCore;
                                console.log(activeIndex);
                            }}
                        >
                            {currentReport.photos.map((photo, id) =>
                                <SwiperSlide key={id}>
                                      <img 
                                        key={id}
                                        src={getIsInternet(window.location.hostname) ? 
                                        `${API_IMAGES_I + photo.image}` : 
                                        `${API_IMAGES +  photo.image}`} 
                                        alt='report img' 
                                        className='dashboard__report_image_src'
                                        onClick={()=>setFullImage(getIsInternet(window.location.hostname) ? 
                                            `${API_IMAGES_I + photo.image}` : 
                                            `${API_IMAGES +  photo.image}`)}
                                    />
                                </SwiperSlide>)}
                        </Swiper>
                    </div>
                       }
                   <div className='dashboard__report_item'>
                    <span>Date & Time</span>
                    {(window.location.pathname.includes('safety') || window.location.pathname.includes('dashboard')) && 
                    <span>{currentReport.date_created}</span>}
                    {(window.location.pathname.includes('idle') || window.location.pathname.includes('machine'))  && 
                    <span>{moment(new Date(currentReport.start_tracking)).format('YYYY-MM-DD')} |  {moment(new Date(currentReport.start_tracking)).format('HH:mm:ss') } - {moment(new Date(currentReport.stop_tracking)).format('HH:mm:ss') }</span>}
                
                   </div>
                   <div className='dashboard__report_item'>
                    <span>Camera</span>
                    <span>{currentReport.camera}</span>
                   </div>
                   <div className='dashboard__report_item'>
                    <span>Algorithm</span>
                    {(window.location.pathname.includes('safety') || window.location.pathname.includes('dashboard')) && 
                    <span>Safety control:{currentReport.action}</span>}
                    {window.location.pathname.includes('idle') &&
                    <span>Idle control</span>}
                     {window.location.pathname.includes('machine') &&
                    <span>Machine control</span>}
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