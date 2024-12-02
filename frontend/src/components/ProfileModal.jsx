import React from 'react';

const ProfileModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-4 rounded-lg">
        <h2 className="text-xl font-bold">User Profile</h2>
        {/* Profile Content */}
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500">X</button>
      </div>
    </div>
  );
};

export default ProfileModal;
