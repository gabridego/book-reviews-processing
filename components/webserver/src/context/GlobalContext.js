import React from 'react';
const NotificationContext = React.createContext({showNotificationSuccess: () => {}, showNotificationError: () => {}});
export default NotificationContext;
