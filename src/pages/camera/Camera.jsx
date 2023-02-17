/* eslint-disable no-unused-vars */
import './Camera.scss';
import { API_CAMERA, API_CAMERA_I } from '../../api/api';
import { useEffect } from 'react';
import { proxy } from '../../api/proxy';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import { getIsInternet } from '../../functions/getURL';
import { Cameras } from '../../components/cameras';
function Camera() {

  return (
    <>
     <Cameras/>
    </>
   
  );
}

export default Camera;
