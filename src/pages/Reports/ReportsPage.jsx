/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import axios from "axios"
import { useCookies } from "react-cookie"
import { Reports } from "../../components/Reports"

import { getIsInternet } from "../../functions/getURL"
import { proxy } from "../../api/proxy"
import { API_REPORT_PAGE, API_REPORT_PAGE_I } from "../../api/api"
import { Timeline } from "../../components/timeline"
import './reportPage.scss'
export const ReportPage = ({control}) => {
    const url = window.location.pathname
    const [data, setData] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(["token"])
    const paginator = (page) =>{
        if (false){
          proxy(API_REPORT_PAGE_I(control,page), "GET", {
            'Authorization': cookies.token
          })
            .then(el => {
              console.log(el)
                el.data.detail === 'Authentication credentials were not provided.' || el.data.detail === "Given token not valid for any token type" ? setData(0) : setData(el.data)
              })
        }
        else{
          axios.get(`http://${window.location.hostname}${API_REPORT_PAGE(control, page)}`,{
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

      useEffect(() => {
        paginator(1)
    },[])
    
    return (
       <>
        {
        !!data  &&  
          <div className='dashboard'>
            <h1>{
              url.includes('safety') ? 'Safety Control: Ear protection'.toUpperCase() :
              url.includes('idle') ? 'Idle Control'.toUpperCase() :
              url.includes('machine') ? 'Machine Control'.toUpperCase() : ''
            }</h1>
           
            {window.location.href.includes('machine') && 
              <section className="report-page_timeline">
                  <div className="report-page_timeline_header">
                    <ul>
                      <li className="green-li"><span>Supervised</span></li>
                      <li className="red-li"><span>Unsupervised</span></li>
                    </ul>
                  </div>
                  <Timeline data={data}/>
              </section>
              }
            <h3>Reports</h3>
            <Reports 
              data={data}
              paginator={(e) =>paginator(e)}
              />
          </div>
     }
       </>
    )
}