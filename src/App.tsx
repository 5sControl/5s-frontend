import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.scss';
import { RoutesOutlet } from './routes/Routes';
import { Company } from './pages/company/Company';
import { Authorization } from './components/authorization/Authorization';
import { useCookies } from 'react-cookie';
import { isVerifyToken } from './api/companyRequest';
import { PreviewOrders } from './pages/previewOrders/previewOrders';
import { Configuration } from './pages/configuration/configuration';
// import { ConfigurationCamera } from './pages/configuration/camera/ConfigurationCamera';
import { Main } from './pages/main/Main';
import { Live } from './pages/live/Live';
import Dashboard from './pages/dashboard/Dashboard';
import { Inventory } from './pages/inventory/inventory';
import { Info } from './pages/info';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    isVerifyToken(window.location.hostname, cookies.token)
      .then((response) => {
        console.log(response);
        if (Object.keys(response.data).length === 0) {
          // console.log('token is available');
        } else {
          removeCookie('token');
        }
      })
      .catch((error) => {
        console.log(error);
        removeCookie('token');
      });
  }, [cookies]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authorization" element={<Authorization />} />
        {cookies.token ? (
          <Route element={<RoutesOutlet />}>
            <Route path="/" element={<Main />} />
            <Route path="/info" element={<Info />} />
            <Route path="/company" element={<Company />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<Live />} />
            <Route path="/configuration" element={<Configuration activeTab={0} />} />
            {/* <Route path="/configuration/license" element={<Configuration activeTab={0} />} /> */}
            <Route path="/configuration/database" element={<Configuration activeTab={1} />} />
            <Route path="/configuration/camera" element={<Configuration activeTab={0} />} />
            <Route path="/configuration/notifications" element={<Configuration activeTab={2} />} />
            {/* <Route path="/configuration/:camera" element={<ConfigurationCamera />} /> */}
            <Route path="/orders-view" element={<PreviewOrders />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>
        ) : (
          <Route path="/*" element={<Authorization />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
