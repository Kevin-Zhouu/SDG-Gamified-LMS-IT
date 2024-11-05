'use client';

import React, { useState, ReactNode, useEffect, ChangeEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


import EditableTextSectionComponent from '@/components/modulePlayer/sections/text/Text';
import QuizSectionComponent from '@/components/modulePlayer/sections/quiz/Quiz';
import ResourceManagerGameComponent from '@/components/modulePlayer/sections/resourceManagerGame/ResourceManagerGame';
import FlashcardSectionComponent from '@/components/modulePlayer/sections/flashcards/Flashcards';
import { EventsSection } from '@/components/info/events/EventsSection';

import SectionCarousel from '@/components/builder/SectionCarousel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, GripVertical, X } from 'lucide-react';
import { Section, HeaderData, Module, SDG } from '@/types/sections';
import { getUserRole } from '@/utils/getUserRole';

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

interface EditableSectionProps {
  section: Section;
  onUpdate?: (updatedSection: Section) => void;
  isEditable?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4 border border-gray-200 rounded-lg p-4 relative">
      <div className="flex justify-between items-center mb-2">
        <div {...attributes} {...listeners}>
          <GripVertical size={24} className="text-gray-400 cursor-move" />
        </div>
        {children}
      </div>
    </div>
  );
};

import EditableHeaderSectionComponent from '@/components/modulePlayer/sections/header/Header';

const SECTION_COMPONENTS: Record<Section["type"], React.FC<EditableSectionProps>> = {
  quiz: QuizSectionComponent as React.FC<EditableSectionProps>,
  text: EditableTextSectionComponent as React.FC<EditableSectionProps>,
  resourceManagerGame: ResourceManagerGameComponent as React.FC<EditableSectionProps>,
  flashcards: FlashcardSectionComponent as React.FC<EditableSectionProps>,
  header: EditableHeaderSectionComponent as React.FC<EditableSectionProps>,
  events: EventsSection as React.FC<EditableSectionProps>,
};

const sectionTypes: Omit<Section, 'id'>[] = [
  { 
    type: 'quiz', 
    title: 'Quiz Section', 
    order_id: 0,
    data: {
      question: '',
      options: [],
      correctAnswer: '',
    }
  },
  { 
    type: 'text', 
    title: 'Text Section', 
    order_id: 0,
    data: {
      content: '',
    }
  },
  { 
    type: 'resourceManagerGame', 
    title: 'Resource Manager Game', 
    order_id: 0,
    data: {}
  },
  { 
    type: 'flashcards', 
    title: 'Flashcard Game', 
    order_id: 0,
    data: {
      title: '',
      cardPairs: [],
    }
  },
  { 
    type: 'events', 
    title: 'Events Section', 
    order_id: 0,
    data: {
      title: '',
      description: '',
      events: [],
    }
  },
];

const RaindropSVG = () => (
  <svg className="Hero6-symbol" viewBox="0 0 512 512" fill="white">
    <path d="M414.21,226.014L256,0L97.791,226.014c-65.493,93.56-29.274,224.629,75.837,269.286C198.933,506.053,226.772,512,256,512s57.067-5.947,82.373-16.699C443.484,450.643,479.701,319.574,414.21,226.014z" />
  </svg>
);

const AdminBuilder: React.FC = () => {
  const router = useRouter();
  const [sdg, setSDG] = useState<SDG>({
    title: '',
    description: '',
    sdg_display_id: 0,
    modules: [],
  });
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const supabase = createClient();

  // Fixed version:
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const userRole = await getUserRole(supabase);
        if (userRole !== "admin") {
          router.push("/");
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        router.push("/");
      }
    };
    
    checkUserRole();
  }, [router, supabase]); // Added supabase to dependency array

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSDGChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSDG(prev => ({ ...prev, [name]: value }));
  };

  const handleAddModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: `New Module ${sdg.modules.length + 1}`,
      subtitle: '',
      order_id: sdg.modules.length,
      sections: [],
    };
    setSDG(prev => ({ ...prev, modules: [...prev.modules, newModule] }));
    setCurrentModuleIndex(sdg.modules.length);
  };

  const handleModuleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    setSDG(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === index ? { ...module, [name]: value } : module
      ),
    }));
  };

  const handleAddSection = (newSection: Omit<Section, 'id'>) => {
    const id = Date.now().toString();
    const order_id = sdg.modules[currentModuleIndex].sections.length;
    
    const sectionToAdd = {
      ...JSON.parse(JSON.stringify(newSection)),
      id,
      order_id,
    };

    setSDG(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) => 
        index === currentModuleIndex
          ? { ...module, sections: [...module.sections, sectionToAdd] }
          : module
      ),
    }));
    setIsCarouselOpen(false);
  };

  const handleRemoveSection = (moduleIndex: number, sectionId: string) => {
    setSDG(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) => 
        index === moduleIndex
          ? { ...module, sections: module.sections.filter(section => section.id !== sectionId) }
          : module
      ),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSDG(prev => ({
        ...prev,
        modules: prev.modules.map((module, index) => 
          index === currentModuleIndex
            ? {
                ...module,
                sections: arrayMove(
                  module.sections,
                  module.sections.findIndex(section => section.id === active.id),
                  module.sections.findIndex(section => section.id === over?.id)
                ).map((section, index) => ({ ...section, order_id: index })),
              }
            : module
        ),
      }));
    }
  };

  const handleUpdateSection = (updatedSection: Section) => {
    setSDG(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) => 
        index === currentModuleIndex
          ? {
              ...module,
              sections: module.sections.map(section => 
                section.id === updatedSection.id ? updatedSection : section
              ),
            }
          : module
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const sdgData = {
        title: sdg.title,
        description: sdg.description,
        sdg_display_id: sdg.sdg_display_id,
        modules: sdg.modules.map(module => ({
          title: module.title,
          subtitle: module.subtitle,
          order_id: module.order_id,
          sections: module.sections.map((section: Section) => ({
            title: section.title,
            data: section.data,
            order_id: section.order_id,
            type: section.type
          }))
        }))
      };

      console.log('Sending data to server:', JSON.stringify(sdgData, null, 2));
  
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('Session:', session);

      const response = await fetch('/api/example/admin_only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(sdgData),
      });
      const result = await response.json();
      if (response.ok) {
        window.open(`/sdg/${result.data.sdg_id}`, '_blank');
        window.location.href = '/';
      } else {
        throw new Error(result.error || 'Failed to save SDG');
      }
    } catch (error) {
      console.error('Error saving SDG:', error);
    }
  };

  const [isModuleEditorOpen, setIsModuleEditorOpen] = useState(false);

  const handleEditModule = (index: number) => {
    setCurrentModuleIndex(index);
    setIsModuleEditorOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[16px] leading-[26px]"
      style={{
        fontFamily: 'hurme_no2-webfont, -apple-system, "system-ui", sans-serif',
        backgroundColor: "#F6F7FB",
      }}>
      {/* Header */}
      <header className="sticky top-0 z-[901] h-16 bg-white">
        <div className="h-full px-6 flex items-center justify-between" style={{ color: "rgb(40, 46, 62)" }}>
          <div className="flex items-center">
            <span className="text-lg font-semibold">SDG Builder</span>
            <svg className="w-4 h-4 ml-1 text-[#939bb4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button 
            className="p-1 bg-gray-100 rounded-md" 
            onClick={() => router.push("/")}
          >
            <X className="w-5 h-5 text-[#586380]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-[#F6F7FB] p-4">
        <div className="w-full max-w-2xl mx-auto">
          {/* Featured Card with Raindrops */}
          <div className="bg-[rgb(44,186,223)] rounded-3xl p-8 mb-8 relative overflow-hidden">
            {/* Raindrops */}
            <div className="Hero6-drop-1" style={{ left: "10%", animationDelay: "0s" }}><RaindropSVG /></div>
            <div className="Hero6-drop-1" style={{ left: "30%", animationDelay: "0.5s" }}><RaindropSVG /></div>
            <div className="Hero6-drop-3" style={{ left: "50%", animationDelay: "1s" }}><RaindropSVG /></div>
            <div className="Hero6-drop-2" style={{ left: "70%", animationDelay: "1.5s" }}><RaindropSVG /></div>
            <div className="Hero6-drop-3" style={{ left: "90%", animationDelay: "2s" }}><RaindropSVG /></div>

            <div className="relative z-10">
              <h2 className="text-center text-sm mb-2 text-white">SDG Details</h2>
              <Input
                type="text"
                name="title"
                value={sdg.title}
                onChange={handleSDGChange}
                placeholder="Enter SDG title"
                className="w-full p-2 mb-4 bg-white/90 backdrop-blur"
              />
              <Input
                type="number"
                name="sdg_display_id"
                value={sdg.sdg_display_id}
                onChange={handleSDGChange}
                placeholder="Enter SDG display ID"
                className="w-full p-2 mb-4 bg-white/90 backdrop-blur"
              />
              <textarea
                name="description"
                value={sdg.description}
                onChange={handleSDGChange}
                placeholder="Enter SDG description"
                className="w-full p-2 mb-4 border rounded-lg min-h-[100px] bg-white/90 backdrop-blur"
              />
            </div>
          </div>

          {/* Modules List */}
          <div className="bg-white rounded-3xl p-6 shadow-md mb-8">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold">Modules</h2>
              <Button onClick={handleAddModule} className="rounded-full bg-[rgb(44,186,223)] text-white hover:bg-[rgb(39,167,200)]">
                <Plus className="mr-2" /> Add Module
              </Button>
            </div>
            
            <ul className="space-y-4">
              {sdg.modules.map((module, index) => (
                <li
                  key={module.id}
                  className="flex items-center p-4 rounded-lg transition duration-300 cursor-pointer hover:bg-gray-50 border"
                >
                  <div className="w-12 h-12 rounded-lg mr-4 flex-shrink-0 flex items-center justify-center bg-orange-200">
                    <span className="text-xl font-bold text-orange-500">{index + 1}</span>
                  </div>
                  <div className="flex-grow">
                    <Input
                      type="text"
                      name="title"
                      value={module.title}
                      onChange={(e) => handleModuleChange(e, index)}
                      placeholder="Enter module title"
                      className="w-full p-2 mb-2"
                    />
                    <Input
                      type="text"
                      name="subtitle"
                      value={module.subtitle}
                      onChange={(e) => handleModuleChange(e, index)}
                      placeholder="Enter module subtitle"
                      className="w-full p-2"
                    />
                  </div>
                  <Button 
                    onClick={() => handleEditModule(index)} 
                    className="ml-4 rounded-full bg-[rgb(44,186,223)] text-white hover:bg-[rgb(39,167,200)]"
                  >
                    Edit
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Module Editor Modal */}
        {isModuleEditorOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center">
            <div className="bg-white rounded-3xl w-[95%] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col m-4">
              {/* Modal Header */}
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Editing: {sdg.modules[currentModuleIndex]?.title}
                </h2>
                <button 
                  onClick={() => setIsModuleEditorOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={sdg.modules[currentModuleIndex]?.sections.map(s => s.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {sdg.modules[currentModuleIndex]?.sections.map((section) => {
                      const SectionComponent = SECTION_COMPONENTS[section.type];
                      return (
                        <SortableItem key={section.id} id={section.id}>
                          <div className="flex-grow">
                            <SectionComponent
                              section={section}
                              onUpdate={handleUpdateSection}
                              isEditable={true}
                            />
                          </div>
                          <Button 
                            onClick={() => handleRemoveSection(currentModuleIndex, section.id)}
                            variant="secondary"
                            className="ml-4"
                          >
                            <X size={24} className="text-red-500" />
                          </Button>
                        </SortableItem>
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t flex justify-between">
                <Button 
                  onClick={() => setIsCarouselOpen(true)} 
                  className="rounded-full bg-[rgb(44,186,223)] text-white hover:bg-[rgb(39,167,200)]"
                >
                  <Plus className="mr-2" /> Add Section
                </Button>
                <Button 
                  onClick={() => setIsModuleEditorOpen(false)}
                  className="rounded-full"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="fixed bottom-8 right-1/2 transform translate-x-1/2">
          <Button onClick={handleSave} className="rounded-full px-8 py-3 bg-[rgb(44,186,223)] text-white hover:bg-[rgb(39,167,200)]">
            Save SDG
          </Button>
        </div>
      </main>

      {/* Section Carousel */}
      {isCarouselOpen && (
        <div className="z-[1001]">
          <SectionCarousel 
            sectionTypes={sectionTypes}
            onSelect={handleAddSection} 
            onClose={() => setIsCarouselOpen(false)} 
          />
        </div>
      )}

      <style jsx>{`
        .Hero6-drop-1,
        .Hero6-drop-2,
        .Hero6-drop-3 {
          position: absolute;
          width: 15px;
          height: 75px;
          opacity: 0.6;
          animation: animation-1dftcq5 3.2s linear infinite;
          pointer-events: none;
          user-select: none;
        }
        .Hero6-drop-2 {
          width: 25px;
          height: 100px;
        }
        .Hero6-drop-3 {
          width: 30px;
          height: 150px;
        }
        @keyframes animation-1dftcq5 {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(calc(100% + 150px));
          }
        }
      `}</style>
    </div>
  );
};

export default AdminBuilder;