import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // User avatar icon
import botLogo from './Purple Spiral Modern Abstract Professional Technology Logo (1).png'; // Path to bot logo
import { getFirestore, doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import { getApp } from 'firebase/app'; // Get initialized Firebase app

// Define the types for chat history entries
interface ChatHistoryProps {
  chatHistory?: { text: string; timestamp: string; isUser: boolean }[]; // Optional chatHistory
  isLoading?: boolean; // Add isLoading prop
}

// Function to save chat history to Firebase with validation to avoid undefined values
const saveChatHistory = async (
  chatHistory: { text: string; timestamp: string; isUser: boolean }[],
  userId: string
) => {
  try {
    // Validate that all chat entries are well-formed before saving
    const validChatHistory = chatHistory.map((chat) => ({
      text: chat.text || '', // Fallback to an empty string if undefined
      timestamp: chat.timestamp || new Date().toISOString(), // Fallback to current timestamp if undefined
      isUser: chat.isUser !== undefined ? chat.isUser : false, // Fallback to 'false' if undefined
    }));

    // Initialize Firestore
    const db = getFirestore(getApp());

    // Save the valid chat history to Firebase Firestore
    await updateDoc(doc(db, 'users', userId), {
      chats: validChatHistory,
    });
    console.log('Chat history saved successfully');
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory = [], isLoading = false }) => {
  return (
    <div className="flex-grow overflow-auto p-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {chatHistory.length > 0 ? (
        chatHistory.map((entry, index) => (
          <div key={index} className={`flex items-start ${entry.isUser ? 'justify-end' : 'justify-start'}`}>
            {/* User Avatar */}
            {entry.isUser ? (
              <FaUserCircle className="text-2xl mr-2 text-black dark:text-white" />
            ) : (
              // Bot Avatar
              <img src={botLogo.src} alt="Bot Avatar" className="w-9 h-9 mr-2 rounded-full" />
            )}

            {/* Chat Message Bubble */}
            <div
              className={`p-4 rounded-lg ${
                entry.isUser ? 'bg-blue-100 dark:bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'
              } text-black dark:text-white max-w-lg`}
            >
              <p>{entry.text}</p>
              {/* Timestamp */}
              <span className="text-xs text-gray-500 dark:text-gray-400">{entry.timestamp}</span>
            </div>
          </div>
        ))
      ) : (
        // Fallback message when no chat history is available
        <p className="text-center text-gray-500 dark:text-gray-400">No messages yet. Start a conversation!</p>
      )}

      {/* Loading Indicator - Displayed only if isLoading is true */}
      {isLoading && (
        <div className="flex items-start justify-start mt-2">
          <img src={botLogo.src} alt="Bot Avatar" className="w-9 h-9 mr-2 rounded-full" />
          <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white max-w-lg">
            <p>Bot is typing...</p>
            <span className="text-xs text-gray-500 dark:text-gray-400">Just a moment...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Example function to handle saving chat history (can be triggered elsewhere)
const handleSaveChat = (chatHistory: { text: string; timestamp: string; isUser: boolean }[]) => {
  const userId = 'Njmamq7VubTsR0sCBDlCl4J8d702'; // Assuming userId is available in your app
  saveChatHistory(chatHistory, userId);
};

export default ChatHistory;
