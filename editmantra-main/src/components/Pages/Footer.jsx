import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-3 w-full shadow-md mt-auto">
      <div className="flex flex-col items-center">
        <div className="flex space-x-4 mb-4">
          <a href="https://twitter.com" className="hover:text-blue-400 transition duration-300">Twitter</a>
          <a href="https://github.com" className="hover:text-gray-400 transition duration-300">GitHub</a>
          <a href="https://linkedin.com" className="hover:text-blue-400 transition duration-300">LinkedIn</a>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} EditMantra. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
