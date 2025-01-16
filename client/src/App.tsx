import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
import MainLayout from "./Layout/MainLayout"
import OverviewPage from "./pages/OverviewPage"
import ProductsPage from "./pages/ProductsPage"
import SalesPage from "./pages/SalesPage"
import StocklistPage from "./pages/StocklistPage"
import ReportsPage from "./pages/ReportsPage"
import Login from "./components/auth/Login"
import NotFoundPage from "./pages/NotFoundPage"
import { Toaster } from "sonner"
import AdminPage from "./pages/AdminPage"
import UsersRoute from "./components/route/UsersRoute"
import AdminRoute from "./components/route/adminRoute"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFoundPage />} />

        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route element={<UsersRoute />}>
            <Route path='/dashboard'>
              <Route path='overview' element={<OverviewPage />} />
              <Route path='products' element={<ProductsPage />} />
              <Route path='sales' element={<SalesPage />} />
              <Route path='stocklist' element={<StocklistPage />} />
              <Route path='reports' element={<ReportsPage />} />
            </Route>
          </Route>
        </Route>
      </>
    )
  )

  return (
    <>
      <Toaster position='top-right' />
      <RouterProvider router={router} />
    </>
  )
}

export default App
