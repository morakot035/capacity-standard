import React from 'react';
import ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Route, Link } from 'react-router-dom'; 
import MainDash from './features/dashboard/MainDash';
import Product from './features/product/Product';
import Plant from './features/plant/Plant';
import Sku from './features/sku/Sku';
import Auth from "./features/auth/Auth"
import { AuthProvider } from "./shared/context";
import ProtectedRoute from "./shared/context/ProtectedRoute";

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
