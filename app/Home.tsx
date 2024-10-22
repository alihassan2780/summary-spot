import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from './Purple Spiral Modern Abstract Professional Technology Logo (1).png'; 

interface HomePageProps {
  startNewChat: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ startNewChat }) => {
  const [welcomeNote, setWelcomeNote] = useState(0);

  const welcomeNotes = [
    "Welcome to the SummarySpot.",
    "Your AI assistant for quick summaries.",
    "Simplify your reading with concise overviews."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeNote((prevNote) => (prevNote + 1) % welcomeNotes.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <motion.img
        src={logo.src} // Access the .src property for the image URL
        alt="Logo"
        className="w-20 h-20 mb-6 rounded-full bg-gray-100"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      <motion.h1
        className="text-black text-4xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {welcomeNotes[welcomeNote]}
      </motion.h1>
      
      <motion.p
        className="text-black text-lg text-center mt-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        This AI-powered assistant is designed to distill information into concise summaries. 
        <br /> 
        Just input your text, and the bot will provide instant, clear summaries to help you grasp key points quickly.
        <br /> 
        Enjoy simplifying your reading! 
      </motion.p>
      
      <motion.button
        onClick={startNewChat}
        className="mt-10 px-8 py-4 bg-black text-white font-bold rounded-md"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Start New Chat
      </motion.button>
    </div>
  );
};

export default HomePage;