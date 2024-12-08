import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
import MainLayout from "./Layout/MainLayout"
import Overview from "./components/Overview"
import Inventory from "./components/Inventory"
import Products from "./components/Products"
import Purchasing from "./components/Purchasing"
import Sales from "./components/Sales"
import Stocklist from "./components/Stocklist"
import Reports from "./components/Reports"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<MainLayout />}>
          <Route path='overview' element={<Overview />} />
          <Route path='inventory' element={<Inventory />} />
          <Route path='products' element={<Products />} />
          <Route path='purchasing' element={<Purchasing />} />
          <Route path='sales' element={<Sales />} />
          <Route path='stocklist' element={<Stocklist />} />
          <Route path='reports' element={<Reports />} />
        </Route>
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default App
