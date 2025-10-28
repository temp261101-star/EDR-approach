import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from 'react-hot-toast';
import { DataProvider } from "./context/DataContext.jsx";

createRoot(document.getElementById("root")).render(

    <BrowserRouter>
    <DataProvider>
      <App />
    </DataProvider>
      
       <Toaster />
    </BrowserRouter>

);
