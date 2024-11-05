"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/utils/getUserRole";

const ProfileSettings: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const supabase = createClient();
  const router = useRouter();
  
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setEmail(user.email || "");
        const role = await getUserRole(supabase);
        setUserRole(role);
      }
    };
    fetchUser();
  }, [supabase, router]);
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const resetEmail = isAdmin ? email : user.email;
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setMessage("Failed to send password reset email. Please try again.");
      } else {
        setMessage("Password reset email sent! Please check the inbox.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="flex-1 p-10 bg-surface">
        <div className="max-w-md mx-auto p-8 rounded-lg bg-default shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-center">Reset Password</h3>
          
          <form onSubmit={handlePasswordReset} className="space-y-4">
            {isAdmin ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="user@email.com"
                />
              </div>
            ) : (
              <div className="text-center mb-4 text-gray-600">
                {user.email}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending Reset Link..." : "Send Password Reset Link"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-md ${
              message.includes("Failed") || message.includes("error")
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}>
              {message}
            </div>
          )}
          
          {isAdmin && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              Admin mode: You can reset password for any user
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;