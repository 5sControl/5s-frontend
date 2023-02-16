/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import './Algorithm.scss'
import {  useEffect, useState } from 'react'
import { getIsInternet } from '../../functions/getURL'
import { API_ALGORITHM_I, API_ALGORITHM, API_CAMERA } from '../../api/api'


import axios from 'axios';
import { proxy } from '../../api/proxy'
import { useCookies } from 'react-cookie'
import { AlgorithmList } from '../../components/algorithmList';

export const Algorithm = () =>{

    const [cookies, setCookie] = useCookies(['token'])

    const [algorithmList, setAlgorithmList] = useState({})

    useEffect(() => {
     
        if (getIsInternet(window.location.host)){
            proxy(API_ALGORITHM_I, "GET", {
                'Authorization': cookies.token
              })
              .then(res => {
                setAlgorithmList(res.data)
                console.log(res.data)
            })
           }
           else{
            axios.get(`http://${window.location.hostname}${API_ALGORITHM}`,{
                    headers: {
                    'Authorization': cookies.token
                    },
                })
                .then(res => {
                    setAlgorithmList(res.data)
                    console.log(res.data.results)
                })
           }

    },[])
    
    return (
       <div className='algorithm'>
       <h1>Algorithms</h1>
       <AlgorithmList 
            algorithmList={algorithmList} 
            algorithmPage={'algorithm'}
            algorithmCount = {3}
        />
       </div>
    )
}