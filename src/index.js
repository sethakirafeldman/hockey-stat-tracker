import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
  <AuthContextProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </AuthContextProvider> 
);