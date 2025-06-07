import "./App.css";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./components/index";
import AuthForm from "./components/AuthForm";
import AuthLayout from "./components/AuthLayout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import MainNavigation from "./components/MainNavigation";
import OrderBook from "./pages/OrderBook";
import Profile from "./pages/Profile";
import { UseLiveData } from "./hooks/use_live_data";
import StockOrder from "./pages/StockOrder";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("access_token");
    return token ? children : <Navigate to="/login" replace />;
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token); // Check if token exists on load
    
  }, []);

  
  // if (isAuthenticated){
  //   useLiveData()
  // }
  // useLiveData()
  // onlU


  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Index />} />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <AuthForm />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainNavigation />
              <UseLiveData />
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/orderbook"
          element={
            <PrivateRoute>
              <OrderBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/stockorder"
          element={
            <PrivateRoute>
              <UseLiveData />
              <StockOrder />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
