import './Dashboard.scss';
import { Fragment, useEffect, useState } from 'react';

import { useCookies } from 'react-cookie';

import { API_URL, API_IMAGES, API_REGISTRATION, API_AUTH } from '../../api/api.js';
import { Algorithm, Camera } from '../../assets/svg/SVGcomponent';
import { proxy, proxyPOST } from '../../api/proxy';
import axios from 'axios';
function Dashboard() {

  const [data, setData] = useState(false)
  const [currentReport, setCurrentReport] = useState(false)
  const [cookies, setCookie] = useCookies(['token']);
  
  useEffect(()=>{
    console.log(cookies)
    proxy('docker', API_URL, "GET", {
      'Authorization': cookies.token
    })
      .then(el => {
          el.data.detail === 'Authentication credentials were not provided.' ? setData(false) : setData(el.data)
          console.log(el)
        })
  },[])
  
  return (
    <>
        {
        data  &&  
          <div className='dashboard'>
            <h1>Dashboard</h1>
            <h2>
              <span className='dashboard__count'>{data.count}&nbsp;</span>
              <span className='dashboard__span'> reports generated today</span>
            </h2>
            <h3>Reports</h3>
            <div className='dashboard__container'>
              <div className='dashboard__choose'>
                <div className='dashboard__tabs'>
                  <span>Date</span>
                  <span>Status</span>
                  <span>Camera</span>
                  <span>Algorithm</span>
                  <span>Sort: Newest</span>
                </div>
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
                   <img src={`${API_IMAGES + currentReport.image}`} alt='report img' className='dashboard__report_image'/>
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
          </div>
     }
    </>
   
  );
}

export default Dashboard;
