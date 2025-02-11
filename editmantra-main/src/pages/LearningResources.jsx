import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LearningResources = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen p-8 bg-gradient-to-r from-green-400 to-blue-500">
        <h2 className="text-3xl text-white">Learning Resources</h2>
        <div className="mt-6 text-white">
          <h3 className="text-2xl">Tutorials</h3>
          <p>Explore tutorials covering a wide range of programming topics.</p>
        </div>
        <div className="mt-6 text-white">
          <h3 className="text-2xl">Challenges</h3>
          <p>Practice coding through interactive challenges tailored to your skill level.</p>
        </div>
        <div className="mt-6 text-white">
          <h3 className="text-2xl">Resources</h3>
          <p>Access a variety of coding resources such as documentation, articles, and more.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LearningResources;
