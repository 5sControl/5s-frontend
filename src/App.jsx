import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './index.scss';
import Dashboard from './pages/dashboard/Dashboard';
import { RoutesOutlet } from './routes/Routes';
import Camera from './pages/camera/Camera';
import { CompanyHub } from './pages/company/CompanyHub';
import { Main } from './pages/main/Main';
import { Authorization } from './pages/company/authorization/Authorization';
import { useCookies } from 'react-cookie';
import { Algorithm } from './pages/algorithm/Algorithm';
function App() {

    const [cookies, setCookie] = useCookies(['token']);

    return (
      <BrowserRouter>
      <Routes>
        {
            cookies.token ?
            <Route element={<RoutesOutlet/>}>
                <Route path="/" element={<Main/>}/>
                <Route path="/company" element={<CompanyHub/>}/>
                <Route
                    path="/dashboard"
                    element={<Dashboard/>}
                />
                <Route
                    path="/camera"
                    element={<Camera/>}
                />
                <Route
                    path="/algorithm"
                    element={<Algorithm/>}
                />
            </Route>
            :
            <Route path="/*" element={<Authorization/>}/>
            
        }
        </Routes>
       </BrowserRouter>
    );
  }
  
  export default App;