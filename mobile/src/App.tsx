import { useEffect } from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useCookies } from "react-cookie";

import "./i18";
import "./index.scss";
import "./styles/common.scss";
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

import { ROUTES } from "./shared/constants/routes";

import { Menu } from "./pages/menu/Menu";
import Connection from "./pages/connections/connection/Connection";
import Connections from "./pages/connections/Connections";
import NewConnection from "./pages/connections/new-connection/NewConnection";
import EditConnection from "./pages/connections/edit-connection/EditConnection";
import ConfigurationMobile from "./pages/configuration/Configuration";
import { OrdersView as OrdersViewMobile } from "./pages/ordersView/ordersView";
import GeneralDirectories from "./pages/directories/GeneralDirecrtories";
import Directories from "./pages/directories/Directories";
import NewDirectory from "./pages/directories/new-directory/NewDirectory";
import DirectoryCard from "./pages/directories/directory/DirectoryCard";
import EditDirectoryCard from "./pages/directories/edit-directory/EditDirectoryCard";
import DirectoryCategory from "./pages/directories/category/DirectoryCategory";
import DirectoryCategoryCard from "./pages/directories/category/category-card/DirectoryCategoryCard";
import NewDirectoryCategory from "./pages/directories/category/new-category/NewDirectoryCategory";
import EditDirectoryCategory from "./pages/directories/category/edit-category/EditDirectoryCategory";
import { OrdersPage } from "./pages/orders/orders";
import AddOrder from "./pages/order/addOrder/addOrder";
import EditOrder from "./pages/order/editOrder/editOrder";
import Order from "./pages/order/order";
import OrderOperations from "./pages/order/orderOperations/orderOperations";
import AddOrderOperation from "./pages/order/addOrderOperation/addOrderOperation";
import AddOrderOperationReference from "./pages/order/addOrderOperationReference/addOrderOperationRerefence";
import NewTimespan from "./pages/timespan/newTimespan/newTimespan";
import EditTimespan from "./pages/timespan/editTimespan/editTimespan";
import { Authorization } from "./components/authorization/Authorization";
import { isVerifyToken } from "./api/authorization";
import { OperationDetail } from "./pages/ordersView/operationDetail/operationDetail";
import Scanner from "./pages/scanner/Scanner";
import Operation from "./pages/operations/operation/Operation";
import Operations from "./pages/operations/Operations";
import NewOperation from "./pages/operations/new-operation/NewOperation";
import EditOperation from "./pages/operations/edit-operation/EditOperation";

setupIonicReact();

function App() {
  const [cookies, , removeCookie] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token) {
      isVerifyToken(cookies.token)
        .then(response => {
          if (Object.keys(response.data).length === 0) {
            // console.log("token is available");
          } else {
            removeCookie("token");
          }
        })
        .catch(error => {
          removeCookie("token");
        });
    }
  }, [cookies]);

  return (
    <IonApp>
      <IonReactRouter basename={import.meta.env.BASE_URL ?? "/"}>
        <Route path="/authorization">
          <Authorization />
        </Route>
        {cookies.token ? (
          <IonRouterOutlet>
            <Route exact path={ROUTES.MENU}>
              <Menu />
            </Route>
            <Route exact path={ROUTES.CONFIGURATION}>
              <ConfigurationMobile />
            </Route>
            <Route exact path={ROUTES.CONNECTIONS}>
              <Connections />
            </Route>
            <Route exact path={ROUTES.CONNECTIONS_ADD}>
              <NewConnection />
            </Route>
            <Route exact path={ROUTES.CONNECTIONS_ITEM(":id")}>
              <Connection />
            </Route>
            <Route exact path={ROUTES.CONNECTIONS_EDIT(":id")}>
              <EditConnection />
            </Route>
            <Route exact path={ROUTES.ORDERSVIEW}>
              <OrdersViewMobile />
            </Route>
            <Route exact path={ROUTES.OPERATIONDETAIL(":id")}>
              <OperationDetail />
            </Route>

            <Route exact path={ROUTES.GENEREAL_DIRECTORIES}>
              <GeneralDirectories />
            </Route>
            <Route exact path={ROUTES.DIRECTORIES_ADD}>
              <NewDirectory />
            </Route>
            <Route exact path={ROUTES.DIRECTORIES_ITEM_CARD(":id")}>
              <DirectoryCard />
            </Route>
            <Route exact path={ROUTES.DIRECTORIES_EDIT_CARD(":id")}>
              <EditDirectoryCard />
            </Route>

            <Route exact path={ROUTES.DIRECTORIES}>
              <Directories />
            </Route>
            <Route exact path={ROUTES.DIRECTORY_CATEGORY(":refId")}>
              <DirectoryCategory />
            </Route>
            <Route exact path={ROUTES.DIRECTORY_CATEGORY_ADD(":refId")}>
              <NewDirectoryCategory />
            </Route>
            <Route exact path={ROUTES.DIRECTORY_CATEGORY_CARD(":refId", ":id")}>
              <DirectoryCategoryCard />
            </Route>
            <Route exact path={ROUTES.DIRECTORY_CATEGORY_EDIT(":refId", ":id")}>
              <EditDirectoryCategory />
            </Route>

            <Route exact path={ROUTES.OPERATIONS}>
              <Operations />
            </Route>
            <Route exact path={ROUTES.OPERATION_ADD}>
              <NewOperation />
            </Route>
            <Route exact path={ROUTES.OPERATION(":id")}>
              <Operation />
            </Route>
            <Route exact path={ROUTES.OPERATION_EDIT(":id")}>
              <EditOperation />
            </Route>

            <Route exact path={ROUTES.ORDERS}>
              <OrdersPage />
            </Route>
            <Route exact path={ROUTES.ORDER}>
              <AddOrder />
            </Route>
            <Route exact path={ROUTES.ORDER_ITEM(":id")}>
              <Order />
            </Route>
            <Route exact path={ROUTES.ORDER_ITEM_EDIT(":id")}>
              <EditOrder />
            </Route>
            <Route exact path={ROUTES.ORDER_OPERATION(":id", ":operationId")}>
              <OrderOperations />
            </Route>
            <Route exact path={ROUTES.ORDER_ADD_OPERATION}>
              <AddOrderOperation />
            </Route>
            <Route exact path={ROUTES.ORDER_OPERATION_ADD_REFERENCE(":id", ":operationId", ":refId")}>
              <AddOrderOperationReference />
            </Route>
            <Route exact path={ROUTES.ORDER_TIMESPAN(":id", ":operationId")}>
              <NewTimespan />
            </Route>
            <Route exact path={ROUTES.ORDER_TIMESPAN_EDIT(":id", ":operationId", ":timespanId")}>
              <EditTimespan />
            </Route>
            <Route exact path={ROUTES.SCANNER}>
              <Scanner />
            </Route>
          </IonRouterOutlet>
        ) : (
          <Route path="/*">
            <Authorization />
          </Route>
        )}
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
