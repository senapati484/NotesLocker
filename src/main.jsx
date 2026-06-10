import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastContainer } from "./components/ToastContainer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <>
      {/* premium custom toast notifications */}
      <ToastContainer />
      
      {/* main content */}
      <App />
    </>
  </BrowserRouter>
);