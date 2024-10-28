'use client';

import React, { useState, ReactNode, useEffect, ChangeEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
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

import { HeaderSection } from '@/components/info/header/HeaderSection';
import { EventsSection } from '@/components/info/events/EventsSection';
import QuizSectionComponent from '@/components/modulePlayer/sections/quiz/Quiz';
import EditableTextSectionComponent from '@/components/modulePlayer/sections/text/Text';
import ResourceManagerGameComponent from '@/components/modulePlayer/sections/resourceManagerGame/ResourceManagerGame';
import FlashcardSectionComponent from '@/components/modulePlayer/sections/flashcards/Flashcards';

import SectionCarousel from '@/components/builder/SectionCarousel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, GripVertical, X } from 'lucide-react';
import { Section, HeaderData, Module, SDG } from '@/types/sections';


interface SortableItemProps {
  id: string;
  children: ReactNode;
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

const SECTION_COMPONENTS: Record<Section['type'], React.FC<{ section: Section; onUpdate: (updatedSection: Section) => void; isEditable?: boolean }>> = {
  quiz: QuizSectionComponent as React.FC<{ section: Section; onUpdate: (updatedSection: Section) => void; isEditable?: boolean }>,
  text: EditableTextSectionComponent as React.FC<{ section: Section; onUpdate: (updatedSection: Section) => void; isEditable?: boolean }>,
  resourceManagerGame: ResourceManagerGameComponent as React.FC<{ section: Section; onUpdate: (updatedSection: Section) => void; isEditable?: boolean }>,
  flashcards: FlashcardSectionComponent as React.FC<{ section: Section; onUpdate: (updatedSection: Section) => void; isEditable?: boolean }>,
  header: HeaderSection as React.FC<{ section: Section; onUpdate: (updatedSection: Section) => void; isEditable?: boolean }>,
  events: EventsSection as React.FC<{ section: Section; onUpdate: (updatedSection: Section) => void; isEditable?: boolean }>,
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

const AdminBuilder: React.FC = () => {
  const [sdg, setSDG] = useState<SDG>({
    title: '',
    description: '',
    sdg_display_id: 0,
    modules: [],
  });
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const supabase = createClient();

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

  // const handleSave = async () => {
  //   try {
  //     const response = await fetch('/api/admin/sdgs', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(sdg),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to save SDG');
  //     }

  //     const result = await response.json();
  //     console.log('SDG saved successfully:', result);
  //     // Optionally, you can reset the form or show a success message here
  //   } catch (error) {
  //     console.error('Error saving SDG:', error);
  //     // Optionally, you can show an error message to the user here
  //   }
  // };


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

      // ... rest of your error handling and logging ...
    } catch (error) {
      console.error('Error saving SDG:', error);
    }
  };

  // const handleSave = () => {
  //   console.log('Data that would be sent to the database:');
  
  //   // Data for the 'sdgs' table
  //   console.log('sdgs table:');
  //   console.log({
  //     title: sdg.title,
  //     description: sdg.description,
  //     sdg_display_id: sdg.sdg_display_id
  //   });
  
  //   // Data for the 'module' table
  //   console.log('\nmodule table:');
  //   sdg.modules.forEach((module, index) => {
  //     console.log(`Module ${index + 1}:`, {
  //       sdg_id: '<would be generated by database>',
  //       title: module.title,
  //       subtitle: module.subtitle,
  //       order_id: index
  //     });
  //   });
  
  //   // Data for the 'section' table
  //   console.log('\nsection table:');
  //   sdg.modules.forEach((module, moduleIndex) => {
  //     module.sections.forEach((section, sectionIndex) => {
  //       console.log(`Module ${moduleIndex + 1}, Section ${sectionIndex + 1}:`, {
  //         module_id: '<would be generated by database>',
  //         data: section.data,
  //         order_id: section.order_id,
  //         title: section.title,
  //         section_type: section.type
  //       });
  //     });
  //   });
  // };

  
  return (
    <div className="container mx-auto p-4 bg-[#F6F7FB]">
      <h1 className="text-3xl font-bold mb-6">SDG Builder</h1>
      <Input
        type="text"
        name="title"
        value={sdg.title}
        onChange={handleSDGChange}
        placeholder="Enter SDG title"
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        name="description"
        value={sdg.description}
        onChange={handleSDGChange}
        placeholder="Enter SDG description"
        className="w-full p-2 mb-4 border rounded"
      />
      <Input
        type="number"
        name="sdg_display_id"
        value={sdg.sdg_display_id}
        onChange={handleSDGChange}
        placeholder="Enter SDG display ID"
        className="w-full p-2 mb-4 border rounded"
      />

      <h2 className="text-2xl font-bold mb-4">Modules</h2>
      {sdg.modules.map((module, index) => (
        <div key={module.id} className="mb-4 p-4 border rounded">
          <Input
            type="text"
            name="title"
            value={module.title}
            onChange={(e) => handleModuleChange(e, index)}
            placeholder="Enter module title"
            className="w-full p-2 mb-2 border rounded"
          />
          <Input
            type="text"
            name="subtitle"
            value={module.subtitle}
            onChange={(e) => handleModuleChange(e, index)}
            placeholder="Enter module subtitle"
            className="w-full p-2 mb-2 border rounded"
          />
          <Button onClick={() => setCurrentModuleIndex(index)} variant="secondary">
            Edit Sections
          </Button>
        </div>
      ))}
      <Button onClick={handleAddModule} variant="secondary" className="mb-4">
        <Plus className="mr-2" /> Add Module
      </Button>

      <h3 className="text-xl font-bold mb-4">Current Module: {sdg.modules[currentModuleIndex]?.title}</h3>
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
                <Button onClick={() => handleRemoveSection(currentModuleIndex, section.id)} variant="secondary">
                  <X size={24} className="text-red-500" />
                </Button>
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
      
      <Button onClick={() => setIsCarouselOpen(true)} variant="secondary" className="mb-4">
        <Plus className="mr-2" /> Add Section
      </Button>
      {isCarouselOpen && (
        <SectionCarousel 
          sectionTypes={sectionTypes}
          onSelect={handleAddSection} 
          onClose={() => setIsCarouselOpen(false)} 
        />
      )}
      <Button onClick={handleSave} variant="primary" className="mt-4">Save SDG</Button>
    </div>
  );
};

export default AdminBuilder;