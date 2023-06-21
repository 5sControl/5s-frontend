import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { RoutesOutlet } from './routes/Routes';
import { Company } from './pages/company/Company';
import { Authorization } from './components/authorization/Authorization';
import { useCookies } from 'react-cookie';
import { isVerifyToken } from './api/companyRequest';
import { PreviewOrders } from './pages/previewOrders/previewOrders';
import { Configuration } from './pages/configuration/configuration';
import { Main } from './pages/main/Main';
import { Live } from './pages/live/Live';
import Dashboard from './pages/dashboard/Dashboard';
import { Inventory } from './pages/inventory/inventory';
import { Info } from './pages/info/info';

import './index.scss';
import { OrderJSON } from './pages/orderJSON/orderJSON';
import { NewContactForm } from './pages/company/contactsTab/NewContactForm';
import { EditContactForm } from './pages/company/contactsTab/EditContactForm';
import { EditCompanyForm } from './pages/company/companyTab/EditCompanyForm';
function App() {
  const [cookies, , removeCookie] = useCookies(['token']);

  useEffect(() => {
    isVerifyToken(window.location.hostname, cookies.token)
      .then((response) => {
        if (Object.keys(response.data).length === 0) {
          // console.log('token is available');
        } else {
          removeCookie('token');
        }
      })
      .catch((error) => {
        // console.log(error);
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
            <Route path="/info/*" element={<Info />} />
            <Route path="/company" element={<Company activeTab={0} />} />
            <Route path="/company/edit" element={<EditCompanyForm />} />
            <Route path="/company/contacts" element={<Company activeTab={1} />} />
            <Route path="/company/contacts/:id" element={<EditContactForm />} />
            <Route path="/company/contacts/newContact" element={<NewContactForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<Live />} />
            <Route path="/configuration" element={<Configuration activeTab={0} />} />
            <Route path="/configuration/database" element={<Configuration activeTab={1} />} />
            <Route path="/configuration/camera" element={<Configuration activeTab={0} />} />
            <Route path="/configuration/notifications" element={<Configuration activeTab={2} />} />
            <Route path="/orders-view" element={<PreviewOrders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/json" element={<OrderJSON />} />
          </Route>
        ) : (
          <Route path="/*" element={<Authorization />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
