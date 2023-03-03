/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
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
function App() {

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  getUserList(window.location.hostname, cookies.token).then((response) => {
    if (response.data.code !== 'token_not_valid') {
      console.log('token is available')
    }else{
      console.log('token is bad')
      removeCookie('token')
    }
  })

  return (
    <BrowserRouter>
      <Routes>
        {cookies.token ? (
          <Route element={<RoutesOutlet />}>
            <Route path="/" element={<Main />} />
            <Route path="/company" element={<Company />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/algorithm" element={<Algorithm />} />
            <Route
              path="/machine_control"
              element={<AlgorithmPage control={"machine_control"} />}
            />
            <Route
              path="/safety_control_ear_protection"
              element={<AlgorithmPage control={"safety_control_ear_protection"} />}
            />
              <Route
              path="/safety_control_reflective_jacket"
              element={<AlgorithmPage control={"safety_control_reflective_jacket"} />}
            />
            <Route
              path="/safety_control_hand_protection"
              element={<AlgorithmPage control={"safety_control_hand_protection"} />}
            />
             <Route
              path="/safety_control_head_protection"
              element={<AlgorithmPage control={"safety_control_head_protection"} />}
            />
            <Route
              path="/idle_control"
              element={<AlgorithmPage control={"idle_control"} />}
            />
            <Route
              path="/staff_control"
              element={<AlgorithmPage control={"staff_control"} />}
            />
            <Route
              path="/staff_control"
              element={<AlgorithmPage control={"staff_control"} />}
            />
            <Route 
              path ="/camera/:id" 
              element = {<CameraPage />}
            />
          </Route>
        ) : (
          <Route path="/*" element={<Authorization />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
