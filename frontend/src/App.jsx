import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/auth.js";

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetails from "./pages/ProductDetails";
import SellerDashboard from './components/SellerDashboard';
import SellerLayout from './layouts/SellerLayout';
import SellerUserInfo from './pages/SellerUserInfo';
import SellerAccount from './pages/SellerAccount';
import CustomerProfile from "./pages/CustomerProfile";
import Cart from "./pages/Cart";

// Layout wrapper for pages with Navbar + Footer
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// PublicRoute for login/register pages
// function PublicRoute({ children }) {
//   const { isLoggedIn } = useContext(AuthContext);
//   return isLoggedIn ? <Navigate to="/home" replace /> : children;
// }

// ProtectedRoute for role-based access
// function ProtectedRoute({ children, allowedRoles }) {
//   const { isLoggedIn, user } = useContext(AuthContext);
//   const location = useLocation();

//   if (!isLoggedIn) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/home" replace />;
//   }

//   return children;
// }

function App() {
  const { isLoggedIn, role } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isLoggedIn? <Home /> : <Login />} />
        <Route path="/register" element={isLoggedIn? <Home /> : <Register />} />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Home accessible to all logged-in users */}
        <Route
          path="/home"
          element={
            isLoggedIn? (
              <Layout><Home /></Layout>
            ) : (
              <Login />
            )
          }
        />

        <Route path="/product-details/:id" element={<Layout><ProductDetails /></Layout>} />


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

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
