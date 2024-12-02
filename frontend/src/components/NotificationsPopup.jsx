import React from 'react';

const NotificationsPopup = ({ onClose }) => {
  return (
    <div className="fixed bottom-0 right-0 m-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <h3 className="font-bold">Notifications</h3>
      <ul>
        <li>Friend request from John Doe</li>
        <li>New message from Jane</li>
      </ul>
      <button onClick={onClose} className="text-red-500 mt-2">Close</button>
    </div>
  );
};

export default NotificationsPopup;
