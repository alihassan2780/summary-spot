import React, { useState, useRef } from 'react';
import { FaPaperclip, FaPaperPlane, FaTimes, FaFileImage, FaFileAlt } from 'react-icons/fa';

interface MessageInputProps {
  sendMessage: (message: string) => void;
  sendFile: (file: File) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage, sendFile, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a reference for the file input

  // Handle sending a message
  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // Handle file selection (PDF or other types)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      sendFile(file);
    }
  };

  // Handle key press event for "Enter"
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null); // Clear the selected file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input field value
    }
  };

  // Determine the icon based on file type
  const renderFileIcon = () => {
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType.startsWith('image/')) {
        return <FaFileImage className="text-blue-500 text-xl mr-2" />;
      }
      return <FaFileAlt className="text-gray-500 text-xl mr-2" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Message input container */}
      <div className="flex items-center bg-gray-100 p-2 rounded-full shadow-inner relative">
        {/* Display the selected file name in a small bubble above the upload icon */}
        {selectedFile && (
          <div className="absolute bottom-14 left-3 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm flex items-center space-x-2">
            {renderFileIcon()} {/* Render the file icon */}
            <span className="truncate max-w-[150px]">
              {selectedFile.name.length > 20
                ? `${selectedFile.name.substring(0, 17)}...`
                : selectedFile.name}
            </span>
            <button onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">
              <FaTimes />
            </button>
          </div>
        )}

        {/* File upload button inside the message input bar, on the left */}
        <label className="text-gray-500 text-xl cursor-pointer mr-2">
          <FaPaperclip />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef} // Reference to the file input
          />
        </label>

        {/* Text input for the message */}
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress} // Send message on Enter key press
          placeholder={isLoading ? 'Processing...' : 'Send a message...'}
          disabled={isLoading} // Disable input while loading
        />

        {/* Send button on the right side */}
        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 ml-2"
          disabled={isLoading} // Disable send button while loading
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
