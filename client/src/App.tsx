import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import StocklistPage from "./pages/StocklistPage";
import ReportsPage from "./pages/ReportsPage";
import Login from "./components/auth/Login";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/Users/Profile";
import NotificationsPage from "./pages/Users/Notifications";
import { Toaster } from "sonner";
import User from "./pages/Admin/User";
import UserGroup from "./pages/Admin/UserGroup";
import UsersRoute from "./components/route/UsersRoute";
import AdminRoute from "./components/route/AdminRoute";
import ItemComponents from "./components/common/ItemComponents";
// import CreateSalesOrder from "./components/common/sales/CreateSalesOrder"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<AdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin">
              <Route path="/admin/users" element={<User />} />
              <Route path="/admin/groups" element={<UserGroup />} />
            </Route>
          </Route>
        </Route>

        <Route element={<MainLayout />}>
          <Route element={<UsersRoute />}>
            <Route path="/dashboard">
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="stocklist" element={<StocklistPage />} />
              <Route path="reports" element={<ReportsPage />} />

              <Route
                path="products/create/components"
                element={<ItemComponents />}
              />
              {/* <Route path='sales/create/customer-order' element={<CreateSalesOrder />} /> */}
            </Route>

            <Route path="/user">
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />

            </Route>
          </Route>
        </Route>
      </>
    )
  );

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
