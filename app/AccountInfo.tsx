import React from 'react';

interface AccountInfoProps {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  onClose: () => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ user, onClose }) => {
  if (!user) {
    return null; // Or handle user not existing
  }

  const { firstName, lastName, email } = user; // Destructure user object

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-2">Account Information</h2>
      <p><strong>Name:</strong> {`${firstName} ${lastName}`}</p>
      <p><strong>Email:</strong> {email}</p>
      <h3 className="mt-4 text-md font-semibold">Web App Information</h3>
      <p>Version: 1.0.0</p>
      <p>Description: <br/>  
          This web application is designed to help users quickly and efficiently summarize their content. 
          Whether it's an article, report, or any lengthy text, the app condenses the material into clear, concise summaries. 
          It allows users to upload documents, provides real-time processing, and supports multiple formats for seamless content extraction and summarization.
        </p>

        <p>
          Key Features:
        </p>
        <ul>
          <li>- Summarize lengthy content with one click.</li>
          <li>- Supports pdf documents to summarize.</li>
          <li>- Clean and user-friendly interface.</li>
        </ul>

      <button onClick={onClose} className="mt-4 px-3 py-1 bg-purple-500 text-white rounded">Close</button>
    </div>
  );
};

export default AccountInfo;
