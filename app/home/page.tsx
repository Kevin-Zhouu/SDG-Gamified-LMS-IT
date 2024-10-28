"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight } from "lucide-react";

// Define types for SDG and UserSdgProgress
interface SDG {
  sdg_id: number;
  sdg_display_id: string;
  title: string;
}

interface UserSdgProgress {
  sdg_id: number;
  progress: 'todo' | 'doing' | 'done';
}

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [sdgs, setSdgs] = useState<SDG[]>([]);
  const [userSdgProgress, setUserSdgProgress] = useState<UserSdgProgress[]>([]);


  // TODO: FIX ADD IF NOT INITIALIZED PROFILE
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        
        // Check if user has a profile, create one if not
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();
  
        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { error: createError } = await supabase
            .from('profiles')
            .insert({ id: user.id, role: 'user' });
  
          if (createError) {
            console.error('Error creating profile:', createError);
          }
        }
      }
    };
    fetchUserData();
  }, [supabase, router]);

  useEffect(() => {
    const fetchSdgs = async () => {
      if (user) {
        const { data, error } = await supabase.from("sdgs").select("*");
        if (error) {
          console.error("Error fetching SDGs:", error);
        } else {
          setSdgs(data as SDG[]);
        }
      }
    };

    const fetchUserSdgProgress = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("usersdgprogress")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching user SDG progress:", error);
        } else {
          setUserSdgProgress(data as UserSdgProgress[]);
        }
      }
    };

    fetchSdgs();
    fetchUserSdgProgress();
  }, [user]);

  const getSdgProgress = (sdgId: number): 'todo' | 'doing' | 'done' => {
    const progress = userSdgProgress.find((p) => p.sdg_id === sdgId);
    return progress ? progress.progress : 'todo';
  };

  const getNextAvailableSdg = (): SDG | undefined => {
    return sdgs.find((sdg) => getSdgProgress(sdg.sdg_id) !== 'done') || sdgs[0];
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[16px] leading-[26px] bg-[#F6F7FB]">
      {/* Header */}
      <header className="sticky top-0 z-[901] h-16 bg-white">
        <div
          className="h-full px-6 flex items-center justify-between"
          style={{ color: "rgb(40, 46, 62)" }}
        >
          <div className="flex items-center">
            <span className="text-lg font-semibold">
              Sustainable Development Goals
            </span>
          </div>
          <div className="flex items-center">
            <button className="px-3 py-1 bg-gray-100 rounded-md text-sm mr-2">
              Options
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="w-full max-w-2xl mx-auto">
          {/* SDG List */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">SDGs</h2>
            <ul className="space-y-4">
              {sdgs.map((sdg) => {
                const progress = getSdgProgress(sdg.sdg_id);

                return (
                  <li
                    key={sdg.sdg_id}
                    className={`rounded-xl p-4 ${
                      progress === 'done' ? 'bg-blue-100' : 'bg-[#F0F3F9]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#4B8BF4] font-semibold">
                        SDG {sdg.sdg_display_id} • SEE DETAILS
                      </span>
                      {progress === 'done' && (
                        <span className="text-blue-500 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-1" /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{sdg.title}</h3>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => router.push(`/sdg/${sdg.sdg_id}`)}
                        className={`py-2 px-4 rounded-full font-semibold transition duration-300 ${
                          progress === 'done'
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-[#4B8BF4] text-white hover:bg-opacity-90'
                        }`}
                      >
                        {progress === 'done' ? "Review" : "Start"}
                      </button>
                      <ChevronRight className="text-gray-400 w-6 h-6" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}