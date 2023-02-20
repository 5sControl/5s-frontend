/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import './Dashboard.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useCookies } from 'react-cookie';

import { Link } from 'react-router-dom';
import { Reports } from '../../components/Reports';
import { getDashboardDate } from '../../api/requests';

function Dashboard() {

  const [data, setData] = useState(false)
  
  const [cookies, setCookie] = useCookies(['token']);
  

  const paginator = (page) =>{
    getDashboardDate(window.location.hostname, cookies.token, moment().format('YYYY-MM-DD'))
        .then(el => {
          console.log(el)
            el.data.detail === 'Authentication credentials were not provided.' || el.data.detail === "Given token not valid for any token type" ? setData(0) : setData(el.data)
          })
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
