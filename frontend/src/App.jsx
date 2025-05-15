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



function App() {
  return (
    <>
    <Routes>
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<AddProducts />} />
      <Route path="/products/update" element={<UpdateProducts />} />
      <Route path = "/products/delete" element={<DeleteProducts/>}/>
      <Route path = "/products/all" element = {<GetAllProducts/>}/>
      <Route path = "/products/get-by-id" element = {<GetProductById/>}/>
      <Route path = "/products/categories" element = {<AllCategories/>}/>
      <Route path = "/orders" element = {<Orders/>}/>
      <Route path = "/orders/add" element = {<AssignOrder/>}/>
      <Route path = "/orders/details" element = {<GetMyOrders/>}/>
      <Route path = "/orders/order-id" element = {<GetOrderById/>}/>
      <Route path = "/orders/get-by-id" element = {<SearchOrders/>}/>
      <Route path = "/orders/filters" element = {<FilterOrders/>}/>
      <Route path = "/orders/data" element = {<ExportOrders/>}/>
    </Routes>
    

    </>
  )
}

export default App
