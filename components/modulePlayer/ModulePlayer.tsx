import React, { useState, useEffect, useRef } from "react";
import { WaterContainer } from "@/components/ui/watercontainer/WaterContainer";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  Section,
  QuizSection,
  TextSection,
  ResourceManagerGameSection,
  FlashcardGameSection,
  HeaderSection as HeaderSectionType,
} from "@/types/sections";
import CelebrationAnimation from "@/public/celebrate.json";
import QuizSectionComponent from "./sections/quiz/Quiz";
import TextSectionComponent from "./sections/text/Text";
import ResourceManagerGameComponent from "./sections/resourceManagerGame/ResourceManagerGame";
import FlashcardSectionComponent from "./sections/flashcards/Flashcards";
import { EventsSection } from "@/components/info/events/EventsSection";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";


interface ModulePlayerProps {
  modules: {
    module_id: string;
    title: string;
    subtitle: string;
    sdg_id: string;
    order_id: number;
  };
  sections: Section[];
  sectionsRef: React.MutableRefObject<{ [key: string]: HTMLElement | null }>;
  onComplete: () => void;
  moduleTitle: string;
  nextModuleId: string | null;
}

interface User {
  id: string;
  [key: string]: any;
}

import EditableHeaderSectionComponent from './sections/header/Header';

const SECTION_COMPONENTS: Record<Section["type"], React.FC<{ section: Section }>> = {
  quiz: QuizSectionComponent as React.FC<{ section: Section }>,
  text: TextSectionComponent as React.FC<{ section: Section }>,
  resourceManagerGame: ResourceManagerGameComponent as React.FC<{ section: Section }>,
  flashcards: FlashcardSectionComponent as React.FC<{ section: Section }>,
  header: EditableHeaderSectionComponent as React.FC<{ section: Section }>,
  events: EventsSection as React.FC<{ section: Section }>,
};

const ModulePlayer: React.FC<ModulePlayerProps> = ({
  modules,
  sections,
  sectionsRef,
  onComplete,
  moduleTitle,
  nextModuleId,
}) => {
  const [progress, setProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);

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
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const newProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setProgress(newProgress);
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleModuleComplete = async () => {
    if (!user) return;
    try {
      // Mark current module as complete
      await supabase.from("usermoduleprogress").upsert({
        user_id: user.id,
        module_id: modules.module_id,
        progress: "done",
        last_updated: new Date().toISOString(),
      });

      // Check if all modules in the SDG are complete
      const { data: allModules } = await supabase
        .from("module")
        .select("module_id")
        .eq("sdg_id", modules.sdg_id);

      const { data: completedModules } = await supabase
        .from("usermoduleprogress")
        .select("module_id")
        .eq("user_id", user.id)
        .eq("progress", "done")
        .in("module_id", allModules!.map(m => m.module_id));

      if (allModules!.length === completedModules!.length) {
        // All modules are complete, mark SDG as complete
        await supabase.from("usersdgprogress").upsert({
          user_id: user.id,
          sdg_id: modules.sdg_id,
          progress: "done",
          last_updated: new Date().toISOString(),
        });
      }

      setIsModuleCompleted(true);
      onComplete();
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        if (nextModuleId) {
          router.push(`/play/${nextModuleId}`);
        } else {
          router.push(`/sdg/${modules.sdg_id}`);
        }
      }, 2000);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };


  return (
    <>
      {showAnimation && (
        <div className="fixed top-0 left-0 right-0 flex justify-center z-[902]">
          <Player
            autoplay
            src={CelebrationAnimation}
            style={{ height: "500px", width: "500px" }}
          />
        </div>
      )}
      <div className="flex bg-[#F6F7FB]">
        {/* Added pt-16 to account for header height */}
        <div className="flex-shrink-0 p-4 pt-16">
          <WaterContainer completed={progress} total={100} />
        </div>
        <div
          ref={containerRef}
          className="flex-grow overflow-y-auto p-4 pt-16"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {sections.map((section, index) => {
            const SectionComponent = SECTION_COMPONENTS[section.type];
            return (
              <motion.div
                key={index}
                ref={(el) => (sectionsRef.current[section.id] = el)}
                id={`section-${section.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-4 mt-8">
                  Section {index + 1}: {section.title}
                </h2>
                <SectionComponent section={section} />
              </motion.div>
            );
          })}
          <div className="mt-8 flex justify-between items-center">
            {!isModuleCompleted && (
              <button
                onClick={handleModuleComplete}
                className="btn-secondary hover:bg-blue-500 hover:text-inverse"
              >
                Complete Module
              </button>
            )}
            {isModuleCompleted && (
              <button
                onClick={() => nextModuleId ? router.push(`/play/${nextModuleId}`) : router.push(`/sdg/${modules.sdg_id}`)}
                className="bg-green-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-green-600 transition duration-300"
              >
                {nextModuleId ? "Next Module" : "Back to SDG"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModulePlayer;