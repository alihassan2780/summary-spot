import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
} from 'firebase/auth';

import logo from './google.png'

interface LoginFormProps {
  onClose: () => void;
  onLogin: (email: string, firstName: string, lastName: string) => void;
  previousEmail?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onLogin, previousEmail }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  // Handle login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert(`Logged in as: ${user.email}`);
      onLogin(user.email || '', '', '');
      onClose();
    } catch (error) {
      alert(`Login error: ${(error as Error).message}`);
    }
  };

  // Handle sign-up submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert(`Account created for: ${user.email}`);
      onLogin(email, firstName, lastName);
      onClose();
    } catch (error) {
      alert(`Sign-up error: ${(error as Error).message}`);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset link sent to ${email}`);
      setIsForgotPassword(false);
      onClose();
    } catch (error) {
      alert(`Error sending reset link: ${(error as Error).message}`);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert(`Logged in with Google: ${user.email}`);
      onLogin(user.email || '', '', '');
      onClose();
    } catch (error) {
      alert(`Google sign-in error: ${(error as Error).message}`);
    }
  };

  // Handle form keypress (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isForgotPassword) {
        e.preventDefault();
      } else {
        isSignUp ? handleSignUpSubmit(e) : handleLoginSubmit(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-96">
        {isForgotPassword ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter your email"
                  required
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-md w-full">
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-gray-500 w-full mt-2 border border-gray-300 rounded-md py-2"
              >
                Cancel
              </button>
            </form>
            <p className="mt-4 text-sm text-center">
              Remembered your password?{' '}
              <button className="text-black hover:text-blue-500" onClick={() => setIsForgotPassword(false)}>
                Log In
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">{isSignUp ? 'Sign Up' : 'Please log in to continue.'}</h2>
            <form onSubmit={isSignUp ? handleSignUpSubmit : handleLoginSubmit}>
              {isSignUp && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter your email"
                  required
                />
                {previousEmail && !isSignUp && (
                  <p className="text-sm text-gray-500">
                    Did you mean: <span className="text-black">{previousEmail}</span>?
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex justify-between mb-4">
                <button className="text-gray-500 hover:text-blue-500" onClick={() => setIsForgotPassword(true)}>
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-md w-full">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
              <button type="button" onClick={onClose} className="text-gray-500 w-full mt-2 border border-gray-300 rounded-md py-2">
                Cancel
              </button>
            </form>

            <div className="my-4 flex items-center">
              <hr className="border-gray-300 flex-grow" />
              <span className="px-4 text-gray-500">OR</span>
              <hr className="border-gray-300 flex-grow" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 w-full text-black"
            >
              <img src={logo.src} alt="Google logo" className="w-5 h-5 mr-2" />
              Sign in with Google
            </button>

            <p className="mt-4 text-sm text-center">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button className="text-black hover:text-blue-500" onClick={() => setIsSignUp(false)}>
                    Log In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button className="text-black hover:text-blue-500" onClick={() => setIsSignUp(true)}>
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
