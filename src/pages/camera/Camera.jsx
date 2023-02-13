import './Camera.scss';
import { API_CAMERA } from '../../api/api';
import { useEffect } from 'react';
import { proxy } from '../../api/proxy';
import { useCookies } from 'react-cookie';
import axios from 'axios';
function Camera() {

  const [cookies, setCookie] = useCookies(['token']);
  
  useEffect(()=>{
    axios.get('http://admin-onvif:just4Taqtile@192.168.1.160/onvif-http/snapshot?Profile_1',{
      headers: {
        'Access-Control-Allow-Credentials' : true,
        'Access-Control-Allow-Origin':'http://localhost:3000',
        'Access-Control-Allow-Methods':'GET',
        'Access-Control-Allow-Headers':'image/jpeg',
      },
      responseType: 'arraybuffer',
      crossDomain: true
    })

    .then(response => {
      console.log(response.data.results)
    })
    
},[])
  return (
    <>
     <img src={'http://admin-onvif:just4Taqtile@192.168.1.160/onvif-http/snapshot?Profile_1'} alt='camera1'/>
    </>
   
  );
}

export default Camera;
