import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isUser: boolean; 
  index: number;    
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, timestamp, isUser, index }) => {
  return (
    <div className={`flex items-start max-w-xl ${isUser ? 'justify-start' : 'justify-end'} mb-2`}>
      <div className="flex-shrink-0">
        <FaUserCircle className="text-3xl text-blue-500" />
      </div>
      <div className="flex flex-col space-y-1">
        <div 
          className={`px-4 py-2 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          <p>{message}</p>
        </div>
        <span className="text-xs text-gray-500 self-end">{timestamp}</span>
      </div>
      {/* Add extra spacing for combined messages */}
      {index > 0 && isUser && (
        <div className="h-2" /> // Space between messages
      )}
    </div>
  );
};

export default ChatBubble;
