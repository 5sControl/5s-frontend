import './Camera.scss';
import { API_CAMERA } from '../../api/api';
import { useEffect } from 'react';
import { proxy } from '../../api/proxy';

function Camera() {

  useEffect(()=>{
    proxy('internet',API_CAMERA, "GET",{
        'Authorization': "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc1OTU0NTAzLCJqdGkiOiI4N2NlYjIwNTg2YWM0YzUyYTM0MGYzMTk3ODIyZTZiMiIsInVzZXJfaWQiOjF9.cQsQQW6FS2nrN2oR7mQ2AgyH_WJ7lfrmP7KitisQz2Q"
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
