import './Camera.scss';
import { API_CAMERA } from '../../api/api';
import { useEffect } from 'react';
import { proxy } from '../../api/proxy';
import { useCookies } from 'react-cookie';
import axios from 'axios';
function Camera() {

  const [cookies, setCookie] = useCookies(['token']);

  useEffect(()=>{
    proxy(API_CAMERA, "GET",{
      'Authorization': cookies.token
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
