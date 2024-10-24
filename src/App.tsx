import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";

import { RoutesOutlet } from "./routes/Routes";
import { Company } from "./pages/company/Company";
import { Authorization } from "./components/authorization/Authorization";
import { useCookies } from "react-cookie";
import { isVerifyToken } from "./api/companyRequest";
import { PreviewOrders } from "./pages/previewOrders/previewOrders";
import { Configuration } from "./pages/configuration/configuration";
import { Main } from "./pages/main/Main";
import { Live } from "./pages/live/Live";
import Dashboard from "./pages/dashboard/Dashboard";
import { Inventory } from "./pages/inventory/inventory";
import { Info } from "./pages/info/info";

import { NewContactForm } from "./pages/company/contactsTab/NewContactForm";
import { EditContactForm } from "./pages/company/contactsTab/EditContactForm";
import { EditCompanyForm } from "./pages/company/companyTab/EditCompanyForm";
import AiChatPage from "./pages/aiChat/AIChat";
import CategoryPage from "./pages/aiChat/components/categoryPage/categoryPage";
import { useAppDispatch } from "./store/hooks";
import { getConnectionsToDB } from "./pages/configuration/connectionSlice";
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
import "./mobile/theme/variables.css";
import "./mobile/styles/common.scss";
import { ROUTES } from "./shared/constants/routes";
import { Menu } from "./mobile/pages/menu/Menu";
import Connection from "./mobile/pages/connections/connection/Connection";
import Connections from "./mobile/pages/connections/Connections";
import NewConnection from "./mobile/pages/connections/new-connection/NewConnection";
import Database from "./mobile/pages/database/Database";
import DatabaseTable from "./mobile/pages/database/database-table/DatabaseTable";
import EditDatabaseEntry from "./mobile/pages/database/edit-database-entry/EditDatabaseEntry";
import NewDatabaseEntry from "./mobile/pages/database/new-database-entry/NewDatabaseEntry";
import ConfigurationMobile from "./mobile/pages/configuration/Configuration";
import { databaseTables } from "./shared/constants/databaseTables";
import { OrdersView as OrdersViewMobile } from "./mobile/pages/ordersView/ordersView";
import EditConnection from "./mobile/pages/connections/edit-connection/EditConnection";

import GeneralDirectories from "./mobile/pages/directories/GeneralDirecrtories";
import NewDirectory from "./mobile/pages/directories/new-directory/NewDirectory";
import DirectoryCard from "./mobile/pages/directories/directory/DirectoryCard";
import EditDirectoryCard from "./mobile/pages/directories/edit-directory/EditDirectoryCard";
import Directories from "./mobile/pages/directories/Directories";
import { OperationDetail } from "./mobile/pages/ordersView/operationDetail/operationDetail";
import DirectoryCategory from "./mobile/pages/directories/category/DirectoryCategory";
import DirectoryCategoryCard from "./mobile/pages/directories/category/category-card/DirectoryCategoryCard";
import NewDirectoryCategory from "./mobile/pages/directories/category/new-category/NewDirectoryCategory";
import EditDirectoryCategory from "./mobile/pages/directories/category/edit-category/EditDirectoryCategory";
import {OrdersPage} from "./mobile/pages/orders/orders";
import AddOrder from "./mobile/pages/order/addOrder/addOrder";
import AddOrderOperation from "./mobile/pages/order/addOrderOperation/addOrderOperation";
import Order from "./mobile/pages/order/order";
import EditOrder from "./mobile/pages/order/editOrder/editOrder";
import OrderOperations from "./mobile/pages/order/orderOperations/orderOperations";
import NewTimespan from "./mobile/pages/timespan/newTimespan/newTimespan";
import EditTimespan from "./mobile/pages/timespan/editTimespan/editTimespan";

setupIonicReact();

function App() {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    isVerifyToken(window.location.hostname, cookies.token)
      .then(response => {
        if (Object.keys(response.data).length === 0) {
          // console.log("token is available");
        } else {
          removeCookie("token");
        }
      })
      .catch(error => {
        // console.log(error);
        removeCookie("token");
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
              <Route path="/configuration/algorithms" element={<Configuration activeTab={3} />} />
              <Route path="/orders-view" element={<PreviewOrders />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/ai-chat?" element={<AiChatPage />} />
              <Route path="/ai-chat/base/:category" element={<CategoryPage />} />


              <Route path={ROUTES.MENU} element={<Menu />} />
              <Route path={ROUTES.CONFIGURATION} element={<ConfigurationMobile />} />
              <Route path={ROUTES.CONNECTIONS} element={<Connections />} />
              <Route path={ROUTES.CONNECTIONS_ADD} element={<NewConnection />} />
              <Route path={ROUTES.CONNECTIONS_ITEM(":id")} element={<Connection />} />
              <Route path={ROUTES.CONNECTIONS_EDIT(":id")} element={<EditConnection />} />
              <Route path={ROUTES.DATABASE} element={<Database />} />
              <Route
                path={ROUTES.DATABASE_CATEGORY("product-categories")}
                element={<DatabaseTable table={databaseTables["productCategories"]} />}
              />

              <Route
                path={ROUTES.DATABASE_CATEGORY("operations")}
                element={<DatabaseTable table={databaseTables["operations"]} />}
              />
              <Route
                path={ROUTES.DATABASE_CATEGORY("employees")}
                element={<DatabaseTable table={databaseTables["employees"]} />}
              />
              <Route
                path={ROUTES.DATABASE_CATEGORY("equipment")}
                element={<DatabaseTable table={databaseTables["equipment"]} />}
              />
              <Route
                path={ROUTES.DATABASE_CATEGORY("products")}
                element={<DatabaseTable table={databaseTables["products"]} />}
              />
              <Route path={ROUTES.DATABASE_ADD_ENTRY(":category")} element={<NewDatabaseEntry />} />
              <Route path={ROUTES.DATABASE_EDIT_ENTRY(":category", ":entry", ":id")} element={<EditDatabaseEntry />} />
              <Route path={ROUTES.ORDERSVIEW} element={<OrdersViewMobile />} />
              <Route path={ROUTES.OPERATIONDETAIL(":id")} element={<OperationDetail />} />
              <Route path={ROUTES.GENEREAL_DIRECTORIES} element={<GeneralDirectories />} />
              <Route path={ROUTES.DIRECTORIES_ADD} element={<NewDirectory />} />
              <Route path={ROUTES.DIRECTORIES_ITEM_CARD(":id")} element={<DirectoryCard />} />
              <Route path={ROUTES.DIRECTORIES_EDIT_CARD(":id")} element={<EditDirectoryCard />} />
              <Route path={ROUTES.DIRECTORIES} element={<Directories />} />

              <Route path={ROUTES.DIRECTORY_CATEGORY(":refId")} element={<DirectoryCategory />} />
              <Route path={ROUTES.DIRECTORY_CATEGORY_ADD(":refId")} element={<NewDirectoryCategory />} />
              <Route path={ROUTES.DIRECTORY_CATEGORY_CARD(":refId", ":id")} element={<DirectoryCategoryCard />} />
              <Route path={ROUTES.DIRECTORY_CATEGORY_EDIT(":refId", ":id")} element={<EditDirectoryCategory />} />
              <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
              <Route path={ROUTES.ORDER} element={<AddOrder />} />
              <Route path={ROUTES.ORDER_OPERATIONS} element={<AddOrderOperation />} />
              <Route path={ROUTES.ORDER_ITEM(":id")} element={<Order />} />
              <Route path={ROUTES.ORDER_ITEM_EDIT(":id")} element={<EditOrder />} />
              <Route path={ROUTES.ORDER_OPERATION(':id', ':operationId')} element={<OrderOperations />} />
              <Route path={ROUTES.ORDER_TIMESPAN(':id', ':operationId')} element={<NewTimespan />} />
              <Route path={ROUTES.ORDER_TIMESPAN_EDIT(':id', ':operationId',':timespanId')} element={<EditTimespan />} />
            

            </Route>
          ) : (
            <Route path="/*" element={<Authorization />} />
          )}
        </Routes>
      </BrowserRouter>
    </IonApp>
  );
}

export default App;
