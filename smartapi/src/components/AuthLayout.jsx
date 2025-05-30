import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
