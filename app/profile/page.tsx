"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

const ProfileSettings: React.FC = () => {
  const [profileName, setProfileName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfileData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfileName(data.full_name);
          setProfilePicture(data.profile_picture);
          setBio(data.bio);
        }
      }
    };
    fetchProfileData();
  }, [supabase]);

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileName,
          bio: bio,
        })
        .eq("id", user.id);
      if (error) {
        console.error("Error updating profile:", error);
      } else {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-default p-6 border-r stroke-outline">
        <h4>Settings</h4>
        <ul>
          <li className="mb-4 bg-blue-100 p-3 rounded-lg font-semibold flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            Profile
          </li>
          <li className="mb-4 p-3 hover:bg-gray-100 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Account
          </li>
          <li className="mb-4 p-3 hover:bg-gray-100 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Notification
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 bg-surface">
        <div className="max-w-2xl mx-auto p-8 rounded-lg bg-default shadow-md">
          <h3 className="flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            Profile
          </h3>
          <div className="mb-6 flex flex-col items-center">
            {!isEditing && (
              <Image
                src={profilePicture || "/placeholder-avatar.png"}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full mb-2"
              />
            )}
            <button
              className="text-blue-500 font-semibold hover:text-blue-600"
              onClick={toggleEditMode}
            >
              {isEditing ? "Change Picture" : "Edit Profile"}
            </button>
          </div>
          <div className="mb-4">
            <label
              className="block text-subtle text-sm font-semibold mb-2"
              htmlFor="profileName"
            >
              Profile Name
            </label>
            <input
              id="profileName"
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="shadow appearance-none border rounded w-full px-4 py-2 text-subtlest leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Profile Name"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-subtle text-sm font-semibold mb-2"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="shadow appearance-none border rounded w-full px-4 py-2 text-subtlest leading-tight focus:outline-none focus:shadow-outline"
              rows={3}
              placeholder="Text"
            />
          </div>
          <button
            onClick={handleProfileUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
