import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './Auth/useAuth';
import Header from './Components/Common/Header';
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
import ExpenseList from './Components/Expenses/ExpenseList';
import ExpenseDetails from './Components/Expenses/ExpenseDetails';
import AddExpenseForm from './Components/Expenses/AddExpenseForm';
import MeetingList from './Components/Meetings/MeetingList';
import MeetingDetails from './Components/Meetings/MeetingDetails';
import AddMeetingForm from './Components/Meetings/AddMeetingfrom';
import MeetingReminder from './Components/Meetings/MeetingReminder';
import SignIn from './Components/Users/Signin'
import SignUp from './Components/Users/Signup';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
    {isLoggedIn && <Header />}
      <main>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/products" /> : <SignIn />} />
          <Route path="/sign-in" element={isLoggedIn ? <Navigate to="/products" /> : <SignIn />} />
          <Route path="/sign-up" element={isLoggedIn ? <Navigate to="/products" /> : <SignUp />} />

          {/* Protected Routes */}
          <Route path="/products" element={isLoggedIn ? <ProductList /> : <Navigate to="/sign-in" />} />
          <Route path="/products/:productId" element={isLoggedIn ? <ProductDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/edit-product/:id" element={isLoggedIn ? <EditProduct /> : <Navigate to="/sign-in" />} />
          <Route path="/add-product" element={isLoggedIn ? <AddProductForm /> : <Navigate to="/sign-in" />} />
          <Route path="/sales" element={isLoggedIn ? <SaleList /> : <Navigate to="/sign-in" />} />
          <Route path="/sales/:saleId" element={isLoggedIn ? <SaleDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/add-sale" element={isLoggedIn ? <AddSaleForm /> : <Navigate to="/sign-in" />} />
          <Route path="/sales-report" element={isLoggedIn ? <SalesReport /> : <Navigate to="/sign-in" />} />
          <Route path="/orders" element={isLoggedIn ? <OrderList /> : <Navigate to="/sign-in" />} />
          <Route path="/orders/:orderId" element={isLoggedIn ? <OrderDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/add-order" element={isLoggedIn ? <AddOrderForm /> : <Navigate to="/sign-in" />} />
          <Route path="/order-tracking" element={isLoggedIn ? <OrderTracking /> : <Navigate to="/sign-in" />} />
          <Route path="/deliveries" element={isLoggedIn ? <DeliveryList /> : <Navigate to="/sign-in" />} />
          <Route path="/deliveries/:deliveryId" element={isLoggedIn ? <DeliveryDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/add-delivery" element={isLoggedIn ? <AddDeliveryForm /> : <Navigate to="/sign-in" />} />
          <Route path="/expenses" element={isLoggedIn ? <ExpenseList /> : <Navigate to="/sign-in" />} />
          <Route path="/expenses/:expenseId" element={isLoggedIn ? <ExpenseDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/add-expense" element={isLoggedIn ? <AddExpenseForm /> : <Navigate to="/sign-in" />} />
          <Route path="/meetings" element={isLoggedIn ? <MeetingList /> : <Navigate to="/sign-in" />} />
          <Route path="/meetings/:id" element={isLoggedIn ? <MeetingDetails /> : <Navigate to="/sign-in" />} />
          <Route path="/add-meeting" element={isLoggedIn ? <AddMeetingForm /> : <Navigate to="/sign-in" />} />
          <Route path="/meeting-reminders" element={isLoggedIn ? <MeetingReminder /> : <Navigate to="/sign-in" />} />
        </Routes>
      </main>
      {isLoggedIn && <Footer />}
    </Router>
  );
}

export default App;
