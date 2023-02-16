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
        // axios.get(`http://192.168.1.101${API_CAMERA}`)
        
        if (getIsInternet(window.location.host)){
            let buf = new Array(5).fill(4).map((el, ind)=>{return{
                id:ind + 1,
                isSelected:false,
                ip:ind === 1 ? '192.168.1.160':'192.168.1.161'
              }})
        } 
        else{
            axios.get(`http://${window.location.hostname}${API_CAMERA}`,{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
              })
                .then(response => {
                    let buf = response.map((el, ind)=>{return{
                        id:ind + 1,
                        isSelected:false,
                        ip:ind === response.data.ip
                      }})
            })
        }
     
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