import React from 'react';
import Footer from './Footer'

function Gamification() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-200 to-sky-200">
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 w-full p-6 shadow-md">
        <h1 className="text-4xl font-bold text-[#5dddd2] text-center">Gamification</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-8 mt-10 bg-gradient-to-b from-green-100 to-sky-100">
        <h2 className="text-3xl font-extrabold mb-4">Engage and Compete</h2>
        <p className="text-lg mb-4">Earn points, badges, and achievements as you complete coding challenges!</p>
      </main>
      <Footer />
    </div>
  );
}

export default Gamification;
