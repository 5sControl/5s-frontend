import './Camera.scss';
import { API_CAMERA } from '../../api/api';
import axios from "axios";
import { useEffect } from 'react';
import { proxy } from '../../api/proxy';

function Camera() {

  useEffect(()=>{
    proxy(API_CAMERA, "GET",{
      
    })
    axios.get(API_CAMERA).then(data => {
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
