import React from 'react';
import Header from './Header';
import Footer from './Footer';

const About = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen p-8 bg-gray-100">
        <h2 className="text-3xl">About Us</h2>
        <p className="mt-4 text-lg">
          We are a platform dedicated to enhancing the learning experience for computer science students
          through real-time collaboration, gamification, and curated learning resources.
        </p>
        <div className="mt-6">
          <h3 className="text-2xl">Our Mission</h3>
          <p>
            Our mission is to create a community-driven platform that encourages students to learn, collaborate,
            and grow their skills in programming and computer science.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
