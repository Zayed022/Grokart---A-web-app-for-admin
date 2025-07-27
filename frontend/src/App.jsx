import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Products from './components/Products'
import AddProducts from './components/AddProducts'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateProducts from './components/UpdateProducts'
import DeleteProducts from './components/DeleteProducts'
import GetAllProducts from './components/GetAllProducts'
import GetProductById from './components/GetProductById'
import AllCategories from './components/AllCategories'
import Orders from './components/Orders'
import AssignOrder from './components/orders/AssignOrder'
import GetMyOrders from './components/orders/GetMyOrders'
import GetOrderById from './components/orders/GetOrderById'
import SearchOrders from './components/orders/SearchOrders'
import FilterOrders from './components/orders/FilterOrders'
import ExportOrders from './components/orders/ExportOrders'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import DeliveryPartner from './components/DeliveryPartner'
import RegisteredDP from './components/deliveryPartners/RegisteredDP'
import Approve from './components/deliveryPartners/Approve'
import GetAllDp from './components/deliveryPartners/GetAllDp'
import GetAllAvailableDP from './components/deliveryPartners/GetAllAvailableDP'
import Search from './components/deliveryPartners/Search'
import DailyCollectionByDP from './components/deliveryPartners/DaolyCollectionByDP'
import DailyEarningsByDP from './components/deliveryPartners/DailyEarningsByDP'
import AllTimeEarningsByDP from './components/deliveryPartners/AllTimeEarningsByDP'
import AllOrdersByTime from './components/deliveryPartners/AllOrdersByTime'
import DeliveryReports from './components/deliveryPartners/DeliveryReports'
import GetCompOrdersByDP from './components/deliveryPartners/GetCompOrdersByDP'
import User from './components/User'
import SearchUser from './components/user/SearchUser'
import FetchUserOrders from './components/user/FetchUserOrders'
import ViewUser from './components/user/ViewUser'
import GetAllUsers from './components/user/GetAllUsers'
import Logout from './components/auth/Logout'
import GetProducts from './components/products/GetProducts'
import GetAllOrders from './components/orders/GetAllOrders'
import UpdatePaymentStatus from './components/orders/UpdatePaymentStatus'
import UpdateStock from './components/products/UpdateStocks'
import CancelOrder from './components/orders/CancelOrder'
import AssignOrderToShop from './components/orders/AssignOrderToShop'
import Shop from './components/Shop'
import RegisteredShop from './components/shop/RegisteredShop'
import ApproveShop from './components/shop/Approve'
import GetAllShop from './components/shop/GetAllShop'
import SearchShop from './components/shop/SearchShop'




function App() {
  return (
    <>
     <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<AddProducts />} />
      <Route path="/products/update" element={<UpdateProducts />} />
      <Route path = "/products/delete" element={<DeleteProducts/>}/>
      <Route path = "/products/get-products" element = {<GetProducts/>}/>
      <Route path = "/products/all" element = {<GetAllProducts/>}/>
      <Route path = "/products/get-by-id" element = {<GetProductById/>}/>
      <Route path = "/products/categories" element = {<AllCategories/>}/>
      <Route path = "/products/stock" element = {<UpdateStock/>}/>
      <Route path = "/orders" element = {<Orders/>}/>
      <Route path = "/orders/add" element = {<AssignOrder/>}/>
      <Route path = "/orders/shop" element = {<AssignOrderToShop/>}/>
      <Route path = "/orders/details" element = {<GetMyOrders/>}/>
      <Route path = "/orders/order-id" element = {<GetOrderById/>}/>
      <Route path = "/orders/get-by-id" element = {<SearchOrders/>}/>
      <Route path = "/orders/filters" element = {<FilterOrders/>}/>
      <Route path = "/orders/all-orders" element = {<GetAllOrders/>}/>
      <Route path = "/orders/payment-status" element = {<UpdatePaymentStatus/>}/>
      <Route path = "/orders/data" element = {<ExportOrders/>}/>
      <Route path = "/orders/cancel-order" element = {<CancelOrder/>}/>
      <Route path = "/delivery-partners" element = {<DeliveryPartner/>}/>
      <Route path = "/delivery/registered" element = {<RegisteredDP/>}/>
      <Route path = "/delivery/approve" element = {<Approve/>}/>
      <Route path = "/delivery/get-all-DP" element = {<GetAllDp/>}/>
      <Route path = "/delivery/get-availableDP" element = {<GetAllAvailableDP/>}/>
      <Route path = "/delivery/search" element = {<Search/>}/>
      <Route path = "/delivery/completed-orders" element = {<GetCompOrdersByDP/>}/>
      <Route path = "/delivery/collection" element = {<DailyCollectionByDP/>}/>
      <Route path = "/delivery/earnings" element = {<DailyEarningsByDP/>}/>
      <Route path = "/delivery/all-time-earnings" element = {<AllTimeEarningsByDP/>}/>
      <Route path = "/delivery/orders-time" element = {<AllOrdersByTime/>}/>
      <Route path = "/delivery/reports" element = {<DeliveryReports/>}/>
      <Route path = "/users" element = {<User/>}/>
      <Route path = "/users/search" element = {<SearchUser/>}/>
      <Route path = "/users/fetch-orders" element = {<FetchUserOrders/>}/>
      <Route path = "/users/users-info" element = {<ViewUser/>}/>
      <Route path = "/users/get-all-users" element = {<GetAllUsers/>}/>
      <Route path = "/shop" element = {<Shop/>}/>
      <Route path = "/shop/registered" element = {<RegisteredShop/>}/>
      <Route path = "/shop/approve" element = {<ApproveShop/>}/>
      <Route path = "/shop/get-all-Shop" element = {<GetAllShop/>}/>
      <Route path = "/shop/search" element = {<SearchShop/>}/>
      
      
    </Routes>
    

    </>
  )
}

export default App
