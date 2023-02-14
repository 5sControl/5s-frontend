import './Algorithm.scss'
import {  useEffect } from 'react'
import { getIsInternet } from '../../functions/getURL'
import { API_ALGORITHM_I, API_ALGORITHM } from '../../api/api'


import axios from 'axios';
import { proxy } from '../../api/proxy'
import { useCookies } from 'react-cookie'

export const Algorithm = () =>{

    const [cookies, setCookie] = useCookies(['token'])
    
    useEffect(() => {
        if (getIsInternet(window.location.host)) {
            proxy(API_ALGORITHM_I, "GET", {
                'Authorization': cookies.token
              })
              .then(res => {
                console.log(res)
            })
           }
           else{
            axios.get(`http://${window.location.hostname}${API_ALGORITHM}`,{
                    headers: {
                    'Authorization': cookies.token
                    },
                })
                .then(res => {
                    console.log(res.data.results)
                })
           }
    },[])
    
    return (
       <>
       </>
    )
}