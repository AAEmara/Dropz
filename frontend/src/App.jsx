import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/auth.js";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetails from "./pages/ProductDetails";
import SellerDashboard from './components/SellerDashboard';
import SellerLayout from './layouts/SellerLayout';
import SellerUserInfo from './pages/SellerUserInfo';
import SellerAccount from './pages/SellerAccount';
import CustomerProfile from "./pages/CustomerProfile";
import Cart from "./pages/Cart";
import MensFashion from "./pages/MensFashion";
import { Provider } from "react-redux";
import store from "./store";
import ContactUs from "./pages/ContactUs.jsx";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
function AppRoutes() {
  const { isLoggedIn, role } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isLoggedIn? <Layout><Home /></Layout> : <Login />} />
        <Route path="/register" element={isLoggedIn? <Layout><Home /></Layout> : <Register />} />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Home accessible to all logged-in users */}
        <Route
          path="/home"
          element={<Layout><Home /></Layout>}
        />
        {/* <Route
          path="/home"
          element={
            isLoggedIn? (
              <Layout><Home /></Layout>
            ) : (
              <Login />
            )
          }
        /> */}
        <Route path="/product-details/:id"
        element={
        isLoggedIn? (
          <Layout><ProductDetails /></Layout>
        ) : (
          <Login />
        )
        }
        />
        {/* About page accessible to all logged-in users */}
        <Route
          path="/about"
          element={
            isLoggedIn? (
              <Layout><About /></Layout>
            ) : (
              <Login />
            )
          }
        />
        {/* Seller routes */}
        <Route
          path="/seller-dashboard"
          element={
            isLoggedIn? (
              role == "seller"? (
                <SellerDashboard />
              ) : (
                <Layout><Home /></Layout>
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/seller-profile/*"
          element={
            isLoggedIn? (
             role == "seller"? (
                <SellerLayout />
              ) : (
                <Layout><Home /></Layout>
              )
            ) : (
              <Login />
            )
          }
        >
          <Route path="seller-user-info" element={<SellerUserInfo />} />
          <Route path="seller-account" element={<SellerAccount />} />
          <Route path="" element={<SellerUserInfo />} />
        </Route>
        {/* Customer routes */}
        <Route
          path="/customer-profile"
          element={
            isLoggedIn? (
              role == "customer"? (
                <Layout><CustomerProfile /></Layout>
              ) : (
                <Layout><Home /></Layout>
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isLoggedIn? (
              <Layout><Cart /></Layout>
            ) : (
              <Login />
            )
          }
        />
        {/* Category routes */}
        <Route
          path="/mens-fashion"
          element={
            isLoggedIn? (
              <Layout><MensFashion /></Layout>
            ) : (
              <Login />
            )
          }
        />
        {/* contact us route */}
        <Route path="/contact-us"
        element={
        isLoggedIn? (
          <Layout><ContactUs /></Layout>
        ) : (
          <Login />
        )
        }
        />
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
export default App;