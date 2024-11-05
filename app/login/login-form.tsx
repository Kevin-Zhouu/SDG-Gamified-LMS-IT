"use client";
import { useState } from "react";

interface LoginFormClientProps {
  signIn: (formData: FormData) => Promise<void>;
  signUp: (formData: FormData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  message?: string;
}

// Separate Button component that doesn't use useFormStatus
function ActionButton({ 
  children, 
  pending, 
  className, 
  onClick,
  type = "button"
}: { 
  children: React.ReactNode;
  pending?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={pending}
    >
      {children}
    </button>
  );
}

export default function LoginFormClient({
  signIn,
  signUp,
  signInWithGoogle,
  message,
}: LoginFormClientProps) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      await signIn(formData);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      await signUp(formData);
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsPending(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setIsPending(false);
    }
  };

  const buttonClassName = "w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const googleButtonClassName = "w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50";

  return (
    <div className="w-full md:w-1/2 bg-white p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUpMode ? "Create an Account" : "Welcome!"}
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        {isSignUpMode ? "Sign up with your details below" : "Enter your details below"}
      </p>

      {isSignUpMode ? (
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">min 8 characters</p>
          </div>

          <ActionButton
            type="submit"
            className={buttonClassName}
            pending={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </ActionButton>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => setIsSignUpMode(false)}
            >
              Sign in here!
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">min 8 characters</p>
          </div>

          <ActionButton
            type="submit"
            className={buttonClassName}
            pending={isPending}
          >
            {isPending ? "Signing In..." : "Sign In"}
          </ActionButton>

          <p className="mt-4 text-center text-sm text-gray-600">
            <a href="/reset-password" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password? Click here!
            </a>
          </p>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => setIsSignUpMode(true)}
            >
              Sign up now!
            </button>
          </p>
        </form>
      )}

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign in with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <ActionButton
            className={googleButtonClassName}
            onClick={handleGoogleSignIn}
            pending={isPending}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            {isPending ? "Signing in with Google..." : "Google"}
          </ActionButton>
        </div>
      </div>

      {message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {message}
        </p>
      )}
    </div>
  );
}