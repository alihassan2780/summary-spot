"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatHistory from './Chatarea';
import MessageInput from './MessageInput';
import HomePage from './Home';
import Navbar from './Navbar';
import { initializeApp } from 'firebase/app';
import { ref, set, onValue, getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const app = (
  {
    "apiKey": "AIzaSyCbErzcAafflJucjPgkBy9AFi7sknLHpTY",
    "authDomain": "summaryspot12.firebaseapp.com",
    "databaseURL": "https://summaryspot12-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "summaryspot12",
    "storageBucket": "summaryspot12.appspot.com",
    "messagingSenderId": "104402233205",
    "appId": "1:104402233205:web:49fd9f332f254ea397553c",
    "measurementId": "G-C76HCJZ37B"
  }
);
const database = getDatabase(app);
const auth = getAuth(app);

interface Message {
  text: string;
  timestamp: string;
  isUser: boolean;
  file?: File; 
}

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Record<number, Message[]>>({});
  const [currentChatIndex, setCurrentChatIndex] = useState<number>(0);
  const [isHomePage, setIsHomePage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Function to save chat history to Firebase 
  const saveChatHistoryToFirebase = async (userId: string) => { 
    try {
      if (!userId) return; 

      const chatRef = ref(database, `users/${userId}/chats/${currentChatIndex}`);
      await set(chatRef, chatHistory[currentChatIndex]);
      console.log("Chat history saved to Firebase.");
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // Function to load chat history from Firebase 
  const loadChatHistoryFromFirebase = (userId: string) => {
    try {
      if (!userId) return; 

      const chatRef = ref(database, `users/${userId}/chats`);

      // Use onValue for real-time updates:
      const offFunction = onValue(chatRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setChatHistory(data);
          console.log("Chat history loaded from Firebase.");
        } else {
          console.log("No chat history available.");
          setChatHistory({}); // Set to empty object if no data
        }
      });

      return () => offFunction(); // Unsubscribe when component unmounts

    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const createNewChat = () => {
    const newIndex = Object.keys(chatHistory).length;
    setChatHistory((prev) => ({ ...prev, [newIndex]: [] }));
    setCurrentChatIndex(newIndex);
    setIsHomePage(false);
  };

  const sendMessage = async (message: string) => {
    const timestamp = new Date().toLocaleString();
    const updatedChat = [
      ...(chatHistory[currentChatIndex] || []),
      { text: message, timestamp, isUser: true },
    ];
    setChatHistory((prev) => ({ ...prev, [currentChatIndex]: updatedChat }));

    setIsLoading(true);

    try {
      const response = await fetch('summary-spot.vercel.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.response) {
        const botMessage: Message = {
          text: data.response,
          timestamp: new Date().toLocaleString(),
          isUser: false,
        };

        // Update the chat history with the bot's response
        setChatHistory((prev) => ({
          ...prev,
          [currentChatIndex]: [...updatedChat, botMessage],
        }));
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorResponseMessage: Message = {
        text: `Error: ${errorMessage}`,
        timestamp: new Date().toLocaleString(),
        isUser: false,
      };

      setChatHistory((prev) => ({
        ...prev,
        [currentChatIndex]: [...updatedChat, errorResponseMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const sendFile = async (file: File) => {
    const timestamp = new Date().toLocaleString();
    const updatedChat = [
      ...(chatHistory[currentChatIndex] || []),
      { text: file.name, timestamp, isUser: true, file },
    ];
    setChatHistory((prev) => ({ ...prev, [currentChatIndex]: updatedChat }));

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);

    try {
      const response = await fetch('summary-spot.vercel.app', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.response) {
        const botMessage: Message = {
          text: data.response,
          timestamp: new Date().toLocaleString(),
          isUser: false,
        };

        // Update the chat history with the bot's response
        setChatHistory((prev) => ({
          ...prev,
          [currentChatIndex]: [...updatedChat, botMessage],
        }));
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorResponseMessage: Message = {
        text: `Error: ${errorMessage}`,
        timestamp: new Date().toLocaleString(),
        isUser: false,
      };

      setChatHistory((prev) => ({
        ...prev,
        [currentChatIndex]: [...updatedChat, errorResponseMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const backToHome = () => {
    setIsHomePage(true);
    setCurrentChatIndex(0);
  };

  const clearHistory = () => {
    setChatHistory({});
    setCurrentChatIndex(0);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Firebase Authentication and Data Loading
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        // User is logged in
        console.log("User logged in:", user.uid); 
        loadChatHistoryFromFirebase(user.uid);
      } else {
        // User is logged out
        console.log("User logged out");
        setChatHistory({}); // Clear on logout (optional)
      }
    });

    return () => unsubscribeAuth(); 
  }, []); 

  // useEffect for saving chat history
  useEffect(() => {
    if (user) { 
      saveChatHistoryToFirebase(user.uid); 
    }
  }, [chatHistory, currentChatIndex, user]); 

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar
          currentChatIndex={currentChatIndex}
          chatHistory={chatHistory}
          createNewChat={createNewChat}
          setCurrentChatIndex={setCurrentChatIndex}
          backToHome={backToHome}
          deleteChat={(index: number) => {
            const updatedChatHistory = { ...chatHistory };
            delete updatedChatHistory[index];
            setChatHistory(updatedChatHistory);
            if (currentChatIndex === index) {
              setCurrentChatIndex(0);
            }
          }}
          renameChat={(index: number, newName: string) => {
            if (newName) {
              const updatedChat = chatHistory[index] || [];
              updatedChat[0] = { ...updatedChat[0], text: newName };
              setChatHistory((prev) => ({ ...prev, [index]: updatedChat }));
            }
          }}
          clearHistory={clearHistory}
        />
        <div className="flex flex-col flex-grow">
          {isHomePage ? (
            <HomePage startNewChat={createNewChat} />
          ) : (
            <div className="flex flex-col flex-grow h-full">
              <ChatHistory
                chatHistory={chatHistory[currentChatIndex]}
                isLoading={isLoading}
              />
              <MessageInput sendMessage={sendMessage} sendFile={sendFile} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
