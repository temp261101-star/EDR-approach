import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from 'react-hot-toast';
import { DataProvider } from "./context/DataContext.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";

createRoot(document.getElementById("root")).render(

    <BrowserRouter>
    <DataProvider>
  <Provider store={store }>
    <App />
  </Provider>
    </DataProvider>      
       <Toaster />
    </BrowserRouter>

);
