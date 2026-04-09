import { useEffect, useRef } from "react";

import { useNotifications } from "../providers/NotificationProvider";

export function useNotificationEffect(message, notify, deps = []) {
  const shownRef = useRef("");
  const notifications = useNotifications();

  useEffect(() => {
    if (!message) {
      shownRef.current = "";
      return;
    }

    if (shownRef.current === message) {
      return;
    }

    shownRef.current = message;
    notify(notifications, message);
  }, [message, notifications, notify, ...deps]);
}
