import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './index.scss';
import Dashboard from './pages/dashboard/Dashboard';
import { RoutesOutlet } from './routes/Routes';
import Camera from './pages/camera/Camera';

function App() {
    return (
      <BrowserRouter>
      <Routes>
            <Route element={<RoutesOutlet/>}>
                <Route path="/" element={<Dashboard/>}/>
                <Route
                    path="/dashboard"
                    element={<Dashboard/>}
                />
                <Route
                    path="/camera"
                    element={<Camera/>}
                />
            </Route>
        </Routes>
       </BrowserRouter>
    );
  }
  
  export default App;