import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = {
  success: (message, autoClose = 3000) => {
    toast.success(message, { autoClose });
  },
  error: (message, autoClose = 5000) => {
    toast.error(message, { autoClose });
  },
  info: (message, autoClose = 4000) => {
    toast.info(message, { autoClose });
  },
  warning: (message, autoClose = 7000) => {
    toast.warning(message, { autoClose });
  },
  custom: (message, options = {}) => {
    toast(message, options);
  },
};

export default ToastNotification;
