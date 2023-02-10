import './Camera.scss';
import { API_CAMERA } from '../../api/api';
import { useEffect } from 'react';
import { proxy } from '../../api/proxy';
import { useCookies } from 'react-cookie';
import axios from 'axios';
function Camera() {

  const [cookies, setCookie] = useCookies(['token']);

  useEffect(()=>{
    axios.get("http://192.168.1.101:8008/find_cameras",{
      headers: {
        'Authorization': cookies.token
      },
    })
    .then(data => {
      // setData(data.data)
      console.log(data)
    })
    
},[])
  return (
    <>
     
    </>
   
  );
}

export default Camera;
