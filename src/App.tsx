import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';

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

import { NewContactForm } from './pages/company/contactsTab/NewContactForm';
import { EditContactForm } from './pages/company/contactsTab/EditContactForm';
import { EditCompanyForm } from './pages/company/companyTab/EditCompanyForm';
import AiChatPage from './pages/aiChat/AIChat';
import CategoryPage from './pages/aiChat/components/categoryPage/categoryPage';
import { useAppDispatch } from './store/hooks';
import { getConnectionsToDB } from './pages/configuration/connectionSlice';

import './index.scss';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './mobile/src/theme/variables.css';
import './mobile/src/styles/common.scss';
import { ROUTES } from './shared/constants';
import { Menu } from './mobile/src/pages/menu/Menu';
import Connection from './mobile/src/pages/connections/connection/Connection';
import Connections from './mobile/src/pages/connections/Connections';
import NewConnection from './mobile/src/pages/connections/new-connection/NewConnection';
import Database from './mobile/src/pages/database/Database';
import DatabaseTable from './mobile/src/pages/database/database-table/DatabaseTable';
import ProductCategories from './mobile/src/pages/database/database-table/product-categories/ProductCategories';
import EditDatabaseEntry from './mobile/src/pages/database/edit-database-entry/EditDatabaseEntry';
import NewDatabaseEntry from './mobile/src/pages/database/new-database-entry/NewDatabaseEntry';
import ConfigurationMobile from './mobile/src/pages/configuration/Configuration'; 

setupIonicReact();

function App() {
  const [cookies, , removeCookie] = useCookies(['token']);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    dispatch(
      getConnectionsToDB({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  return (
    <IonApp>
      <BrowserRouter>
        <Routes>
          <Route path='/authorization' element={<Authorization />} />
          {cookies.token ? (
            <Route element={<RoutesOutlet />}>
              <Route path='/' element={<Main />} />
              <Route path='/info/*' element={<Info />} />
              <Route path='/company' element={<Company activeTab={0} />} />
              <Route path='/company/edit' element={<EditCompanyForm />} />
              <Route path='/company/contacts' element={<Company activeTab={1} />} />
              <Route path='/company/contacts/:id' element={<EditContactForm />} />
              <Route path='/company/contacts/newContact' element={<NewContactForm />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/live' element={<Live />} />
              <Route path='/configuration' element={<Configuration activeTab={0} />} />
              <Route path='/configuration/database' element={<Configuration activeTab={1} />} />
              <Route path='/configuration/camera' element={<Configuration activeTab={0} />} />
              <Route path='/configuration/notifications' element={<Configuration activeTab={2} />} />
              <Route path='/configuration/algorithms' element={<Configuration activeTab={3} />} />
              <Route path='/orders-view' element={<PreviewOrders />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path='/ai-chat?' element={<AiChatPage />} />
              <Route path='/ai-chat/base/:category' element={<CategoryPage />} />

              <Route path={ROUTES.MENU}  element={<Menu />} />
                  <Route path={ROUTES.CONFIGURATION}  element={<ConfigurationMobile />} />
                  <Route path={ROUTES.CONNECTIONS}  element={<Connections />} />
                  <Route path={ROUTES.CONNECTIONS_ADD} element={<NewConnection />} />
                  <Route path={ROUTES.CONNECTIONS_ITEM(':id')} element={<Connection />} />
                  {/* <Route path={ROUTES.CONNECTIONS_EDIT(':id')} element={<EditConnection />} /> */}
                  <Route path={ROUTES.DATABASE}  element={<Database />} />
                  <Route path={ROUTES.DATABASE_CATEGORY('productCategories')}  element={<ProductCategories />} />
                  <Route path={ROUTES.DATABASE_CATEGORY('operations')}  element={<DatabaseTable name='operations' />} />
                  <Route path={ROUTES.DATABASE_CATEGORY('employees')}  element={<DatabaseTable name='employees' />} />
                  <Route path={ROUTES.DATABASE_CATEGORY('equipment')}  element={<DatabaseTable name='equipment' />} />
                  <Route path={ROUTES.DATABASE_CATEGORY('products')}  element={<DatabaseTable name='products' />} />
                  <Route path={ROUTES.DATABASE_ADD_ENTRY(':category')} element={<NewDatabaseEntry />} />
                  <Route path={ROUTES.DATABASE_EDIT_ENTRY(':category', ':entry', ':id')} element={<EditDatabaseEntry />} />
            </Route>
          ) : (
            <Route path='/*' element={<Authorization />} />
          )}
        </Routes>
      </BrowserRouter>
    </IonApp>
  );
}

export default App;