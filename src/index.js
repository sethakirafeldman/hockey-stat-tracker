import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { AuthContextProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <AuthContextProvider>
    <App />
  </AuthContextProvider> 
);