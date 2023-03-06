/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.scss";
import Dashboard from "./pages/dashboard/Dashboard";
import { RoutesOutlet } from "./routes/Routes";
import {Camera} from "./pages/camera/Camera";
import { Company } from "./pages/company/Company";
import { Main } from "./pages/main/Main";
import { Authorization } from "./components/authorization/Authorization";
import { useCookies } from "react-cookie";
import { Algorithm } from "./pages/algorithm/Algorithm";
import { getUserList } from "./api/companyRequest";
import { AlgorithmPage } from "./pages/algorithm/algorithmReport/AlgorithmPage";
import { CameraPage } from "./pages/camera/cameraReport/cameraPage";
import { Preloader } from "./components/preloader";
function App() {

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [isStart, setIsStart] = useState(null);
  
  useEffect(() => {
    getUserList(window.location.hostname, cookies.token).then((response) => {
      console.log(response)
      // if (response.data.detail === 'Given token not valid for any token type' || response.data.detail === 'Authentication credentials were not provided.') {
      //   console.log('token is bad')
      //   removeCookie('token')
      //   setIsStart(true)
      // }else{
      //   setIsStart(true)
      //   console.log('token is available')
      // }
    })
  },[cookies])

  return (
    <BrowserRouter>
      <Routes>
        {cookies.token //&& isStart
        ? (
          <Route element={<RoutesOutlet />}>
            <Route path="/" element={<Main />} />
            <Route path="/company" element={<Company />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/algorithm" element={<Algorithm />} />
            <Route path="/algorithm/:type" element={<AlgorithmPage />} />
            <Route 
              path ="/camera/:id" 
              element = {<CameraPage />}
            />
          </Route>
        ) : 
          <Route path="/*" element={
         //   isStart ?

          <Authorization /> 
        //  :<Preloader loading={true} />
        } />
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
