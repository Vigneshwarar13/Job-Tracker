/**
 * Browser Notification API helpers
 */

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if (Notification.permission === "granted") {
    return new Notification(title, {
      icon: "/favicon.svg",
      ...options,
    });
  }
};
