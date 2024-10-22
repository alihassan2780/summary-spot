import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaBars, FaDownload } from 'react-icons/fa';

interface Message {
  text: string;
  timestamp: string;
  isUser: boolean;
}

interface SidebarProps {
  currentChatIndex: number;
  chatHistory: Record<number, Message[]>;
  createNewChat: () => void;
  setCurrentChatIndex: (index: number) => void;
  backToHome: () => void; // Add this line
  deleteChat: (index: number) => void;
  renameChat: (index: number, newName: string) => void;
  clearHistory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentChatIndex,
  chatHistory,
  createNewChat,
  setCurrentChatIndex,
  backToHome, // Include this prop
  deleteChat,
  renameChat,
  clearHistory,
}) => {
  const chatIndices = Object.keys(chatHistory).map(Number);
  const [chatNames, setChatNames] = useState<Record<number, string>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleRenameChat = (index: number) => {
    const newName = prompt('Enter new name') || 'New Chat';
    setChatNames((prev) => ({
      ...prev,
      [index]: newName,
    }));
  };

  const handleDownloadChat = (index: number) => {
    const chat = chatHistory[index];
    const chatText = chat.map(message => `${message.timestamp}: ${message.text}`).join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${index}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-screen ${isCollapsed ? 'bg-gray-100' : 'bg-gray-200'} text-black p-4 transition-width duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <h2 className="text-black-500 text-xl font-semibold">Chat History</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-500 hover:text-blue-500">
          <FaBars />
        </button>
      </div>
      {!isCollapsed && (
        <>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-black py-2 px-4 mb-4 w-full text-left rounded-md"
            onClick={createNewChat}
          >
            + New Chat
          </button>
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-150px)]">
            {chatIndices.map((index) => (
              <div key={index} className="flex justify-between items-center">
                <button
                  className={`flex-grow text-left px-4 py-2 rounded-md ${index === currentChatIndex ? 'bg-gray-300' : 'bg-gray-200'} hover:bg-gray-400 flex items-center justify-between`}
                  onClick={() => setCurrentChatIndex(index)}
                >
                  <span>{chatNames[index] || chatHistory[index][0]?.text.slice(0, 10) || 'New Chat'}</span>
                  <div className="flex space-x-2">
                    <button
                      className="text-gray-500 hover:text-blue-500"
                      onClick={() => handleDownloadChat(index)}
                    >
                      <FaDownload />
                    </button>
                    <button
                      className="text-gray-500 hover:text-blue-500"
                      onClick={() => handleRenameChat(index)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => deleteChat(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </button>
              </div>
            ))}
          </div>
          <button
            className="bg-red-400 hover:bg-red-500 text-black py-2 px-4 mt-4 w-full text-left rounded-md"
            onClick={clearHistory}
          >
            Clear History
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
