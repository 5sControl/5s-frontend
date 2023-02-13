import './Camera.scss';
import { API_CAMERA } from '../../api/api';
import { useEffect } from 'react';
import { proxy } from '../../api/proxy';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import { getIsInternet } from '../../functions/getURL';
function Camera() {

  const [cookies, setCookie] = useCookies(['token']);

  useEffect(()=>{

    if (getIsInternet(window.location.host)){
    axios.post("https://5scontrol.pl/proxy_to_ngrok",{
            url: `http://${window.location.hostname}`+API_CAMERA,
            method: "GET",
        })
    .then(response => {
      console.log(response.data.results)
    })
  } else{
    axios.get(`http://${window.location.hostname}`+API_CAMERA)
      .then(response => {
        console.log(response.data.results)
      })
  }
},[])
  return (
    <>
     <img src={'http://admin-onvif:just4Taqtile@192.168.1.160/onvif-http/snapshot?Profile_1'} alt='camera1'/>
    </>
   
  );
}

export default Camera;
