import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Common/Header';
import Sidebar from './Components/Common/SideBar';
import Footer from './Components/Common/Footer';
import ProductList from './Components/Inventory/ProductList';
import ProductDetails from './Components/Inventory/ProductDetails';
import EditProduct from './Components/Inventory/EditProductForm';
import AddProductForm from './Components/Inventory/AddProductForm';
import SaleList from './Components/Sales/SaleList';
import SaleDetails from './Components/Sales/SaleDetails';
import AddSaleForm from './Components/Sales/AddSaleForm';
import SalesReport from './Components/Sales/SalesReport';
import OrderList from './Components/Orders/OrderList';
import OrderDetails from './Components/Orders/OrderDetails';
import AddOrderForm from './Components/Orders/AddOrderForm';
import OrderTracking from './Components/Orders/OrderTracking';
import DeliveryList from './Components/Deliveries/DeliveryList';
import DeliveryDetails from './Components/Deliveries/DeliveryDetail';
import AddDeliveryForm from './Components/Deliveries/AddDeliveryForm';
import DeliveryTracking from './Components/Deliveries/DeliveryTracking';
import ExpenseList from './Components/Expenses/ExpenseList';
import ExpenseDetails from './Components/Expenses/ExpenseDetails';
import AddExpenseForm from './Components/Expenses/AddExpenseForm';
import ExpenseReport from './Components/Expenses/ExpenseReport';
import MeetingList from './Components/Meetings/MeetingList';
import MeetingDetails from './Components/Meetings/MeetingDetails';
import AddMeetingForm from './Components/Meetings/AddMeetingfrom';
import MeetingReminder from './Components/Meetings/MeetingReminder';

function App() {
  return (
    <Router>
      <Header />
      <Sidebar />
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/add-product" element={<AddProductForm />} />
          <Route path="/sales" element={<SaleList />} />
          <Route path="/sales/:saleId" element={<SaleDetails />} />
          <Route path="/add-sale" element={<AddSaleForm />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/add-order" element={<AddOrderForm />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/deliveries" element={<DeliveryList />} />
          <Route path="/deliveries/:deliveryId" element={<DeliveryDetails />} />
          <Route path="/add-delivery" element={<AddDeliveryForm />} />
          <Route path="/delivery-tracking" element={<DeliveryTracking />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/expenses/:expenseId" element={<ExpenseDetails />} />
          <Route path="/add-expense" element={<AddExpenseForm />} />
          <Route path="/expense-report" element={<ExpenseReport />} />
          <Route path="/meetings" element={<MeetingList />} />
          <Route path="/meetings/:id" element={<MeetingDetails />} />
          <Route path="/add-meeting" element={<AddMeetingForm />} />
          <Route path="/meeting-reminders" element={<MeetingReminder />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
