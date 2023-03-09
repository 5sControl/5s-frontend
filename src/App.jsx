import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.scss';
import Dashboard from './pages/dashboard/Dashboard';
import { RoutesOutlet } from './routes/Routes';
import { Company } from './pages/company/Company';
import { Main } from './pages/main/Main';
import { Authorization } from './components/authorization/Authorization';
import { useCookies } from 'react-cookie';
import { isVerifyToken } from './api/companyRequest';
import { PreviewOrders } from './pages/previewOrders/previewOrders';
import { Configuration } from './pages/configuration/configuration';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    isVerifyToken(window.location.hostname, cookies.token).then((response) => {
      console.log(response);
      if (Object.keys(response.data).length === 0) {
        console.log('token is available');
      } else {
        removeCookie('token');
      }
    });
  }, [cookies]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authorization" element={<Authorization />} />
        {cookies.token ? (
          <Route element={<RoutesOutlet />}>
            <Route path="/" element={<Main />} />
            <Route path="/company" element={<Company />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/orders-view" element={<PreviewOrders />} />
          </Route>
        ) : (
          <Route path="/*" element={<Authorization />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
