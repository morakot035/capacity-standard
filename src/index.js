import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Route, Link } from 'react-router-dom'; 
import MainDash from './components/MainDash/MainDash';
import Product from './components/Product/Product';
import Plant from './components/Plant/Plant';
import Sku from './components/SKU/Sku';
import Auth from "./components/Auth/Auth"
import { AuthProvider } from "./context";
import ProtectedRoute from "./context/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth /> 
  },
  {
    path: "*",
    element: <Auth /> 
  },
  {
    path: "/mainDash",
    element: <>
    <ProtectedRoute>
      <MainDash /> 
    </ProtectedRoute>
    </>
  },
  {
    path: "/product",
    element: <>
    <ProtectedRoute>
      <Product /> 
    </ProtectedRoute>
    </>
  },
  {
    path: "/plant",
    element: <>
    <ProtectedRoute>
      <Plant /> 
    </ProtectedRoute>
    </>
  },
  {
    path: "/sku",
    element: <>
    <ProtectedRoute>
      <Sku /> 
    </ProtectedRoute>
    </>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
