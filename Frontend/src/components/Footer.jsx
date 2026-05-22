import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-sm mt-auto border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MERN Assessment. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
