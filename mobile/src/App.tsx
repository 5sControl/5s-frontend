import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "./store/hooks";
import "./i18";
import "./index.scss";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";
import "./styles/common.scss";
import { ROUTES } from './shared/constants/routes'; 
import { Menu } from "./pages/menu/Menu";
import Connection from "./pages/connections/connection/Connection";
import Connections from "./pages/connections/Connections";
import NewConnection from "./pages/connections/new-connection/NewConnection";
import ConfigurationMobile from "./pages/configuration/Configuration";
import { databaseTables } from "./shared/constants/databaseTables";
import { OrdersView as OrdersViewMobile } from "./pages/ordersView/ordersView";
import EditConnection from "./pages/connections/edit-connection/EditConnection";

import GeneralDirectories from "./pages/directories/GeneralDirecrtories";
import NewDirectory from "./pages/directories/new-directory/NewDirectory";
import DirectoryCard from "./pages/directories/directory/DirectoryCard";
import EditDirectoryCard from "./pages/directories/edit-directory/EditDirectoryCard";
import Directories from "./pages/directories/Directories";
import { OperationDetail } from "./pages/ordersView/operationDetail/operationDetail";
import DirectoryCategory from "./pages/directories/category/DirectoryCategory";
import DirectoryCategoryCard from "./pages/directories/category/category-card/DirectoryCategoryCard";
import NewDirectoryCategory from "./pages/directories/category/new-category/NewDirectoryCategory";
import EditDirectoryCategory from "./pages/directories/category/edit-category/EditDirectoryCategory";
import {OrdersPage} from "./pages/orders/orders";
import AddOrder from "./pages/order/addOrder/addOrder";
import AddOrderOperation from "./pages/order/addOrderOperation/addOrderOperation";
import Order from "./pages/order/order";
import EditOrder from "./pages/order/editOrder/editOrder";
import OrderOperations from "./pages/order/orderOperations/orderOperations";
import NewTimespan from "./pages/timespan/newTimespan/newTimespan";
import EditTimespan from "./pages/timespan/editTimespan/editTimespan";

setupIonicReact();

function App() {
  const [cookies, , removeCookie] = useCookies(["token"]);
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   isVerifyToken(window.location.hostname, cookies.token)
  //     .then(response => {
  //       if (Object.keys(response.data).length === 0) {
  //         // console.log("token is available");
  //       } else {
  //         removeCookie("token");
  //       }
  //     })
  //     .catch(error => {
  //       // console.log(error);
  //       removeCookie("token");
  //     });
  // }, [cookies]);

  // useEffect(() => {
  //   dispatch(
  //     getConnectionsToDB({
  //       token: cookies.token,
  //       hostname: window.location.hostname,
  //     })
  //   );
  // }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* <Route path="/authorization">
            <Authorization/>
          </Route> */}

          {cookies.token ? (
            <>
              <Route path={ROUTES.MENU}>
                  <Menu />
              </Route>
              <Route path={ROUTES.CONFIGURATION}>
                  <ConfigurationMobile />
              </Route>
              <Route path={ROUTES.CONNECTIONS}>
                  <Connections />
              </Route>
              <Route path={ROUTES.CONNECTIONS_ADD}>
                  <NewConnection />
              </Route>
              <Route path={ROUTES.CONNECTIONS_ITEM(":id")}>
                  <Connection />
              </Route>
              <Route path={ROUTES.CONNECTIONS_EDIT(":id")}>
                  <EditConnection />
              </Route>
              <Route path={ROUTES.ORDERSVIEW}>
                  <OrdersViewMobile />
              </Route>
              <Route path={ROUTES.OPERATIONDETAIL(":id")}>
                  <OperationDetail />
              </Route>
              <Route path={ROUTES.GENEREAL_DIRECTORIES}>
                  <GeneralDirectories />
              </Route>
              <Route path={ROUTES.DIRECTORIES_ADD}>
                  <NewDirectory />
              </Route>
              <Route path={ROUTES.DIRECTORIES_ITEM_CARD(":id")}>
                  <DirectoryCard />
              </Route>
              <Route path={ROUTES.DIRECTORIES_EDIT_CARD(":id")}>
                  <EditDirectoryCard />
              </Route>
              <Route path={ROUTES.DIRECTORIES}>
                  <Directories />
              </Route>
              <Route path={ROUTES.DIRECTORY_CATEGORY(":refId")}>
                  <DirectoryCategory />
              </Route>
              <Route path={ROUTES.DIRECTORY_CATEGORY_ADD(":refId")}>
                  <NewDirectoryCategory />
              </Route>
              <Route path={ROUTES.DIRECTORY_CATEGORY_CARD(":refId", ":id")}>
                  <DirectoryCategoryCard />
              </Route>
              <Route path={ROUTES.DIRECTORY_CATEGORY_EDIT(":refId", ":id")}>
                  <EditDirectoryCategory />
              </Route>
              <Route path={'/orders'}>
                  <OrdersPage />
              </Route>
              <Route path={'/order/'}>
                  <AddOrder />
              </Route>
              <Route path={'/order/operations'}>
                  <AddOrderOperation />
              </Route>
              <Route path={'/order/:id'}>
                  <Order />
              </Route>
              <Route path={'/order/:id/edit'}>
                  <EditOrder />
              </Route>
              <Route path={'/order/:id/operation/:operationId'}>
                  <OrderOperations />
              </Route>
              <Route path={'/order/:id/operation/:operationId/timespan'}>
                  <NewTimespan />
              </Route>
              <Route path={'/order/:id/operation/:operationId/timespan/:timespanId/edit'}>
                  <EditTimespan />
              </Route>
                </>
          ) : (
            <Route path="/*">
              <Menu/>
              {/* <Authorization /> */}
            </Route>
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
