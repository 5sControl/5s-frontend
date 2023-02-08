import './Camera.scss';
import { API_CAMERA } from '../../api/api';
import axios from "axios";
import { useEffect } from 'react';

function Camera() {

  useEffect(()=>{
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
