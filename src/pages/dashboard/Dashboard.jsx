/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import './Dashboard.scss';
import { useEffect, useState } from 'react';

import { useCookies } from 'react-cookie';

import { API_DASHBOARD_PAGE, API_DASHBOARD_PAGE_I} from '../../api/api.js';

import { proxy } from '../../api/proxy';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { getIsInternet } from '../../api/getURL';
import { Reports } from '../../components/Reports';

function Dashboard() {

  const [data, setData] = useState(false)
  
  const [cookies, setCookie] = useCookies(['token']);
  

  const paginator = (page) =>{
    if (getIsInternet(window.location.host)){

      proxy(API_DASHBOARD_PAGE_I(page), "GET", {
        'Authorization': cookies.token
      })
        .then(el => {
          console.log(el)
            el.data.detail === 'Authentication credentials were not provided.' || el.data.detail === "Given token not valid for any token type" ? setData(0) : setData(el.data)
          })
    }
    else{
      axios.get(`http://${window.location.hostname}${API_DASHBOARD_PAGE(page)}`,{
            headers: {
              'Authorization': cookies.token
            },
          })
        .then(el => {
          console.log(el)
            el.data.detail === 'Authentication credentials were not provided.' || el.data.detail === "Given token not valid for any token type" ? setData(0) : setData(el.data)
          })
      }
  }
  
  useEffect(() =>{
    paginator(1)
  },[])

  return (
    <>
        {
        !!data  &&  
          <div className='dashboard'>
            <h1>Dashboard</h1>
            <h2>
              <span className='dashboard__count'>{data.count}&nbsp;</span>
              <span className='dashboard__span'> reports generated today</span>
            </h2>
            <h3>Reports</h3>
            <Reports 
              data={data}
              paginator={(e) =>paginator(e)}
              />
          </div>
     }
     {
      data === 0 && 
      <h2 className='dashboard__noauth'>
        Log in to view the reports
        <Link to ='/company'> Log In</Link>
      </h2>
     }
    
    </>
   
  );
}

export default Dashboard;
