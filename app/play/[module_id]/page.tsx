"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import ModulePlayer from "@/components/modulePlayer/ModulePlayer";
import { Section, HeaderData } from "@/types/sections";

interface PlayModuleProps {
  params: {
    module_id: string;
  };
}

interface User {
  id: string;
}

interface Module {
  module_id: string;
  title: string;
  subtitle?: string;
  sdg_id: number;
  order_id: number;
}

const PlayModule: React.FC<PlayModuleProps> = ({ params: { module_id } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [nextModuleId, setNextModuleId] = useState<string | null>(null);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

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
    const fetchModuleAndSections = async () => {
      if (user) {
        try {
          const { data: moduleData, error: moduleError } = await supabase
            .from("module")
            .select("module_id, title, subtitle, sdg_id, order_id")
            .eq("module_id", module_id)
            .single();

          if (moduleError) throw moduleError;
          setModule(moduleData);

          // Fetch next module
          try {
            const { data: nextModule, error } = await supabase
              .from("module")
              .select("module_id")
              .eq("sdg_id", moduleData.sdg_id)
              .gt("order_id", moduleData.order_id)
              .order("order_id", { ascending: true })
              .limit(1)
              .single();
          
            if (error && error.code !== 'PGRST116') {
              console.error("Error fetching next module:", error);
            }
            setNextModuleId(nextModule?.module_id || null);
          } catch (error) {
            console.error("Unexpected error fetching next module:", error);
            setNextModuleId(null);
          }

          const { data: sectionsData, error: sectionsError } = await supabase
            .from("section")
            .select("section_id, order_id, title, section_type, data")
            .eq("module_id", module_id)
            .order("order_id", { ascending: true });

          if (sectionsError) throw sectionsError;

          const formattedSections: Section[] = sectionsData.map((section: any) => ({
            id: section.section_id,
            title: section.title,
            order_id: section.order_id,
            type: section.section_type as Section['type'],
            data: section.data,
          }));

          // Add header section if it doesn't exist
          if (!formattedSections.some(section => section.type === 'header')) {
            const headerSection: Section = {
              id: 'header',
              title: 'Module Introduction',
              order_id: 0,
              type: 'header',
              data: {
                newsTitle: 'Module News',
                newsContent: 'Latest updates for this module',
                mainTitle: moduleData.title,
                mainSubtitle: moduleData.subtitle || 'Learn and explore',
                backgroundColor: 'bg-blue-500',
                newsBannerColor: 'bg-yellow-300',
                definitionTitle: 'About This Module',
                definitionPara: 'Explore and learn about important concepts',
              } as HeaderData,
            };
            formattedSections.unshift(headerSection);
          }

          setSections(formattedSections);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      }
    };
    fetchModuleAndSections();
  }, [user, module_id, supabase]);

  useEffect(() => {
    const handleScrollToSection = () => {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.replace('#section-', '');
        const sectionElement = sectionsRef.current[sectionId];
        if (sectionElement) {
          setTimeout(() => {
            sectionElement.scrollIntoView({ behavior: 'smooth' });
          }, 100); // Small delay to ensure the component is fully rendered
        }
      }
    };

    if (!isLoading) {
      handleScrollToSection();
    }
  }, [isLoading, searchParams]);

  const handleMarkAsComplete = async () => {
    if (user && module) {
      try {
        // Fetch the user's profile first
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
  
        if (profileError) throw profileError;
  
        const { error } = await supabase.from("usermoduleprogress").upsert({
          user_id: profile.id,
          module_id: module.module_id,
          progress: "done",
          last_updated: new Date().toISOString(),
        });
  
        if (error) throw error;
        console.log("Progress updated successfully");
        setShowCompletionOverlay(true);
        setTimeout(() => {
          setShowCompletionOverlay(false);
          if (nextModuleId) {
            router.push(`/play/${nextModuleId}`);
          } else {
            router.push(`/sdg/${module.sdg_id}`);
          }
        }, 3000);
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  if (isLoading || !module || sections.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      {showCompletionOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Module Complete!</h2>
            <p className="text-lg">
              Congratulations on completing this module.
            </p>
          </div>
        </div>
      )}
      <ModulePlayer
        modules={{
          module_id: module.module_id,
          title: module.title,
          subtitle: module.subtitle ?? "",
          sdg_id: module.sdg_id.toString(),
          order_id: module.order_id,
        }}
        sections={sections}
        sectionsRef={sectionsRef}
        onComplete={handleMarkAsComplete}
        moduleTitle={module.title}
        nextModuleId={nextModuleId}
      />
      {nextModuleId && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => router.push(`/play/${nextModuleId}`)}
            className="bg-blue-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-600 transition duration-300"
          >
            Next Module
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayModule;