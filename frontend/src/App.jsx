import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext,useEffect } from "react";
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
import { Provider } from "react-redux";
import store from "./store";
import MenFashion from "./pages/MenFashion";
import WomenFashion from "./pages/WomenFashion";
import Electronics from "./pages/Electronics";
import KidsFashion from "./pages/KidsFashion";
import HomeLifestyle from "./pages/HomeLifestyle";
import Baby from "./pages/Baby";
import ToysGames from "./pages/ToysGames.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Sports from "./pages/Sports.jsx";
import Health from "./pages/Health.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import { useDispatch } from 'react-redux';
import { loadCart } from './store/slices/cart';
import { loadWishlist } from './store/slices/wishlist';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
function AppRoutes() {
  const { isLoggedIn, role } = useContext(AuthContext);
  const dispatch = useDispatch();

   useEffect(() => {
    if (isLoggedIn && role === 'customer') {
      dispatch(loadCart());
      dispatch(loadWishlist());
    }
  }, [dispatch, isLoggedIn, role]);
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
           <Route
          path="/wishlist"
          element={
            isLoggedIn? (
              <Layout><Wishlist /></Layout>
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
              <Layout><MenFashion /></Layout>
            ) : (
              <Login />
            )
          }
        />
        
        <Route
          path="/womens-fashion"
          element={
            isLoggedIn? (
              <Layout><WomenFashion /></Layout>
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/electronics"
          element={
            isLoggedIn? (
              <Layout><Electronics /></Layout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/kids-fashion"
          element={
            isLoggedIn? (
              <Layout><KidsFashion /></Layout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/home&lifestyle"
          element={
            isLoggedIn? (
              <Layout><HomeLifestyle /></Layout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/baby"
          element={
            isLoggedIn? (
              <Layout><Baby /></Layout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/toys&games"
          element={
            isLoggedIn? (
              <Layout><ToysGames /></Layout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/sports"
          element={
            isLoggedIn? (
              <Layout><Sports /></Layout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/health"
          element={
            isLoggedIn? (
              <Layout><Health /></Layout>
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