"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for client-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UpdatePassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: user } = await supabase.auth.getUser();

      if (!user) {
        // If no user is authenticated, redirect to login or show an error
        setError("Invalid or expired reset link.");
        setLoading(false);
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      } else {
        setLoading(false); // User is authenticated; proceed with password reset
      }
    };

    checkAuth();
  }, [router]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update the password using the Supabase client
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError("Failed to update password. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => router.replace("/login"), 3000); // Redirect to login after success
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-6">Password Updated</h2>
            <p className="text-sm text-gray-600 mb-6">
              Your password has been successfully updated. You can now{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-500">
                log in
              </a>{" "}
              with your new password.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Please enter your new password below.
          </p>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter new password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}