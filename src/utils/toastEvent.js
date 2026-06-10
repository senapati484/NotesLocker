// Global event emitter for the custom toast system
export const toastEvents = {
  listeners: [],
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  },
  emit(toast) {
    this.listeners.forEach((cb) => cb(toast));
  },
};
