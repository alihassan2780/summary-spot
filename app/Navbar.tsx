import React, { useState, useEffect } from 'react';
import { FaShareAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaTelegramPlane, FaInstagram } from 'react-icons/fa';
import LoginForm from './Login'; // Ensure this import matches your file structure
import AccountInfo from './AccountInfo'; // Import the new component
import logo from './Purple Spiral Modern Abstract Professional Technology Logo (1).png';

const Navbar: React.FC = () => { // Removed theme prop
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [user, setUser] = useState<{ email: string; firstName: string; lastName: string } | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isAccountInfoVisible, setIsAccountInfoVisible] = useState(false);
  const [URL, setURL] = useState('');

  useEffect(() => {
    // Accessing window only on client-side
    setURL(window.location.href);
  }, []);

  const handleLoginClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsLoginFormVisible(true);
    closeAllMenus();
  };

  const handleCloseLoginForm = () => {
    setIsLoginFormVisible(false);
  };

  const handleLogin = (email: string, firstName: string, lastName: string) => {
    setUser({ email, firstName, lastName });
    handleCloseLoginForm();
  };

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    return parts.map(part => part.charAt(0).toUpperCase()).join('');
  };

  const handleShare = (platform: string, event: React.MouseEvent) => {
    event.stopPropagation();
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(URL)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(URL)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(URL)}`;
        break;
      case 'telegram':
        shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(URL)}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(URL)}`;
        break;
      default:
        alert('Sharing not supported for this platform.');
        return;
    }

    window.open(shareUrl, '_blank');
  };

  const toggleShareMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    closeAllMenus();
    setIsShareMenuOpen((prev) => !prev);
  };

  const toggleAccountMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    closeAllMenus();
    setIsAccountMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setUser(null);
    closeAllMenus();
  };

  const handleMyAccountClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    closeAllMenus();
    setIsAccountInfoVisible(true);
  };

  const handleCloseAccountInfo = () => {
    setIsAccountInfoVisible(false);
  };

  const closeAllMenus = () => {
    setIsShareMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(URL)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        alert('Failed to copy: ' + err);
      });
  };

  return (
    <>
      <header className="w-full flex justify-between items-center bg-white p-4 border-b">
        <div className="flex items-center text-black">
          <a href="/" className="flex items-center">
            <img src={logo.src} alt="SummarySpot Logo" className="w-8 h-8 mr-2" />
            <span className="text-lg font-semibold hover:underline">SummarySpot</span>
          </a>
        </div>

        <div className="flex items-center relative">
          <button
            className="mr-2 px-3 py-1 rounded border border-gray-300 bg-transparent hover:bg-gray-100 flex items-center"
            onClick={toggleShareMenu}
          >
            <FaShareAlt />
            <span className="ml-1">Share</span>
          </button>

          {user ? (
            <div className="relative inline-block text-left">
              <button 
                onClick={toggleAccountMenu}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-400 text-white focus:outline-none"
                aria-haspopup="true"
              >
                {getInitials(user.email)}
              </button>

              {isAccountMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                    <a 
                      href="#"
                      onClick={handleMyAccountClick}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      My Account
                    </a>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Logout
                    </button>
                    <button 
                      onClick={closeAllMenus}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleLoginClick} 
              className="bg-transparent border border-purple-500 text-purple-500 hover:bg-purple-100 px-3 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {isShareMenuOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50" 
          onClick={closeAllMenus}
        >
          <div 
            className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeAllMenus} 
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <span aria-hidden="true">×</span>
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Share this link via</h2>

            <div className="flex space-x-4 justify-center">
              <button onClick={(e) => handleShare('facebook', e)} className="rounded-full p-2 bg-blue-800 text-white hover:bg-blue-900 transition duration-300">
                <FaFacebookF className="w-6 h-6" />
              </button>
              <button onClick={(e) => handleShare('twitter', e)} className="rounded-full p-2 bg-blue-400 text-white hover:bg-blue-500 transition duration-300">
                <FaTwitter className="w-6 h-6" />
              </button>
              <button onClick={(e) => handleShare('instagram', e)} className="rounded-full p-2 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 text-white hover:opacity-90 transition duration-300">
                <FaInstagram className="w-6 h-6" /> 
              </button>
              <button onClick={(e) => handleShare('whatsapp', e)} className="rounded-full p-2 bg-green-500 text-white hover:bg-green-600 transition duration-300">
                <FaWhatsapp className="w-6 h-6" />
              </button>
              <button onClick={(e) => handleShare('telegram', e)} className="rounded-full p-2 bg-blue-600 text-white hover:bg-blue-700 transition duration-300">
                <FaTelegramPlane className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 font-medium">Or copy link</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <input 
                type="text" 
                value={URL} 
                readOnly 
                className="border p-2 w-full mr-2 rounded" 
              />
              <button 
                onClick={handleCopyLink} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
     {/* Account Info Popup Modal */}
    {isAccountInfoVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50" onClick={handleCloseAccountInfo}>
        <div className="bg-white py-5 px-8 rounded-lg  w-full max-w-lg h-auto relative" onClick={e => e.stopPropagation()}>
          <AccountInfo user={user} onClose={handleCloseAccountInfo} />
        </div>
      </div>
    )}

      {isLoginFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50" onClick={handleCloseLoginForm}>
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseLoginForm} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
              <span aria-hidden="true">×</span>
            </button>

            {/* Include your LoginForm here */}
            <LoginForm onClose={handleCloseLoginForm} onLogin={handleLogin} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
