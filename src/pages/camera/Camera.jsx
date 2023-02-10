import './Camera.scss';
import { API_CAMERA } from '../../api/api';
import { useEffect } from 'react';
import { proxy } from '../../api/proxy';
import { useCookies } from 'react-cookie';
import axios from 'axios';
function Camera() {

  const [cookies, setCookie] = useCookies(['token']);

  useEffect(()=>{

    axios.post("https://5scontrol.pl/proxy_to_ngrok",{
            url: API_CAMERA,
            method: "GET",
            headers: {'Authorization': cookies.token},
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
