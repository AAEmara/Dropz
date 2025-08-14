import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SellerDashboard from './components/SellerDashboard';
import SellerProfile from "./pages/SellerProfile";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

const isLoggedIn = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token); // exp is in seconds
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("access_token");
      return false;
    }
    return true;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("access_token");
    return false;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller-profile" element={<SellerProfile />} />

        <Route
          path="/"
          element={
            isLoggedIn() ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/home"
          element={
            isLoggedIn() ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
