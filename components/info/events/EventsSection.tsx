import React, { useState, useEffect } from 'react';
import EventsCard from './EventsCard';
import { Section } from '@/types/sections';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface EventsSectionProps {
  section: Section & {
    type: 'events';
    data: {
      title: string;
      description: string;
      events: Array<{
        imgSrc: string;
        title: string;
        date: string;
        href?: string;
      }>;
    };
  };
  onUpdate: (updatedSection: Section) => void;
  isEditable?: boolean;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ section, onUpdate, isEditable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSection, setLocalSection] = useState(section);

  useEffect(() => {
    setLocalSection(section);
  }, [section]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, title: e.target.value },
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, description: e.target.value },
    });
  };

  const handleEventChange = (index: number, field: string, value: string) => {
    const newEvents = [...localSection.data.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, events: newEvents },
    });
  };

  const handleAddEvent = () => {
    setLocalSection({
      ...localSection,
      data: {
        ...localSection.data,
        events: [
          ...localSection.data.events,
          { imgSrc: '', title: '', date: '', href: '' },
        ],
      },
    });
  };

  const handleRemoveEvent = (index: number) => {
    const newEvents = localSection.data.events.filter((_, i) => i !== index);
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, events: newEvents },
    });
  };

  const handleSave = () => {
    onUpdate(localSection);
    setIsEditing(false);
  };

  const renderEditMode = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Edit Events Section</h3>
      <Input
        type="text"
        value={localSection.data.title}
        onChange={handleTitleChange}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Section Title"
      />
      <Textarea
        value={localSection.data.description}
        onChange={handleDescriptionChange}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Section Description"
      />
      {localSection.data.events.map((event, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <Input
            type="text"
            value={event.imgSrc}
            onChange={(e) => handleEventChange(index, 'imgSrc', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Image URL"
          />
          <Input
            type="text"
            value={event.title}
            onChange={(e) => handleEventChange(index, 'title', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Event Title"
          />
          <Input
            type="text"
            value={event.date}
            onChange={(e) => handleEventChange(index, 'date', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Event Date"
          />
          <Input
            type="text"
            value={event.href}
            onChange={(e) => handleEventChange(index, 'href', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Event Link"
          />
          <Button onClick={() => handleRemoveEvent(index)} variant="secondary">
            Remove Event
          </Button>
        </div>
      ))}
      <Button onClick={handleAddEvent} variant="secondary" className="mb-4">
        Add Event
      </Button>
      <Button onClick={handleSave} variant="primary" className="w-full">
        Save Changes
      </Button>
    </div>
  );

  const renderViewMode = () => (
    <section className='py-20 px-16 flex flex-col justify-items-center gap-20'>
      <div className="h-[84px] flex-col gap-6 inline-flex">
        <div className="self-stretch text-center text-black text-[35px] font-semibold font-['Poppins'] leading-10">
          {localSection.data.title}
        </div>
        <div className="self-stretch text-center text-black text-base font-normal font-['Poppins'] leading-tight">
          {localSection.data.description}
        </div>
      </div>
      <div className="justify-center items-center gap-8 inline-flex">
        {localSection.data.events.map((event) => (
          <div key={event.title} className="justify-center items-center gap-8 inline-flex">
            <EventsCard
              imgSrc={event.imgSrc}
              title={event.title}
              date={event.date}
              href={event.href}
            />
          </div>
        ))}
      </div>
      {isEditable && (
        <Button onClick={() => setIsEditing(true)} variant="secondary" className="mt-4">
          Edit Events
        </Button>
      )}
    </section>
  );

  return isEditing ? renderEditMode() : renderViewMode();
};

export default EventsSection;
