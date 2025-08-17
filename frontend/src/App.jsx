import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
