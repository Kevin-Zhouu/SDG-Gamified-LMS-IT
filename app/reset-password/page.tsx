"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for client-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordReset = async () => {
    const origin = window.location.origin;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/update-password`, // Supabase will add `?access_token=token`
      });

      if (error) {
        setError("Failed to send password reset email. Please try again.");
        console.error("Error sending password reset email:", error.message);
      } else {
        setEmailSent(true); // Show success message if the email was sent
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", err);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (email) {
      setError("");
      await handlePasswordReset();
    } else {
      setError("Please enter a valid email address.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            {emailSent
              ? "If an account with that email exists, a reset link has been sent. Please check your inbox."
              : "Enter your email address to receive a password reset link."
            }
          </p>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">Back to <a href="/login" className="text-blue-600 hover:text-blue-500">Login</a></p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}