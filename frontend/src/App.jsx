import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SellerDashboard from './components/SellerDashboard';
import SellerLayout from './layouts/SellerLayout';
import SellerUserInfo from './pages/SellerUserInfo';
import SellerAccount from './pages/SellerAccount';
import CustomerProfile from "./pages/CustomerProfile";
import Cart from "./pages/Cart";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// const isLoggedIn = () => {
//   const token = localStorage.getItem("access_token");
//   if (!token) return false;

//   try {
//     const { exp } = jwtDecode(token); // exp is in seconds
//     if (Date.now() >= exp * 1000) {
//       localStorage.removeItem("access_token");
//       return false;
//     }
//     return true;
//   } catch (err) {
//     console.error("Invalid token:", err);
//     localStorage.removeItem("access_token");
//     return false;
//   }
// };

function App() {
  const { isLoggedIn } = useContext(AuthContext)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isLoggedIn? <Navigate to='/home'/>: <Login/>} />
        <Route path="/register" element={isLoggedIn? <Navigate to='/home'/> :<Register />} />
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        // <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        {/* New seller profile routes with persistent sidebar */}
        <Route path="/seller-profile/*" element={<SellerLayout />}>
          <Route path="seller-user-info" element={<SellerUserInfo />} />
          <Route path="seller-account" element={<SellerAccount />} />
          <Route path="" element={<SellerUserInfo />} />

        </Route>
        <Route path="/customer-profile" 
               element={
                isLoggedIn? (
                  <Layout><CustomerProfile /></Layout>)
                  :(<Navigate to='/login' />
                )} />
        <Route path="/cart"
               element={
                isLoggedIn?(
                <Layout><Cart /></Layout>)
              :(<Navigate to='/login' />)
              } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
