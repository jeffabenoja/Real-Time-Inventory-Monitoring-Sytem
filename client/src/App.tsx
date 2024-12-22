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
import Register from "./components/auth/Register"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<MainLayout />}>
          <Route path='overview' element={<OverviewPage />} />
          <Route path='products' element={<ProductsPage />} />
          <Route path='sales' element={<SalesPage />} />
          <Route path='stocklist' element={<StocklistPage />} />
          <Route path='reports' element={<ReportsPage />} />
        </Route>
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default App
