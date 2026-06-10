import { toastEvents } from "../utils/toastEvent";

const ToastNotification = {
  success: (message, duration = 3000) => {
    toastEvents.emit({ id: Math.random(), type: "success", message, duration });
  },
  error: (message, duration = 5000) => {
    toastEvents.emit({ id: Math.random(), type: "error", message, duration });
  },
  warning: (message, duration = 5000) => {
    toastEvents.emit({ id: Math.random(), type: "warning", message, duration });
  },
  info: (message, duration = 4000) => {
    toastEvents.emit({ id: Math.random(), type: "info", message, duration });
  },
  custom: (message, duration = 3000) => {
    toastEvents.emit({ id: Math.random(), type: "info", message, duration });
  },
};

export default ToastNotification;
