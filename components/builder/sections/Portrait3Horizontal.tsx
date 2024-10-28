import React, { useState } from 'react';
import Image from 'next/image';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Portrait3HorizontalContent {
  title: string;
  description: string;
  topic: string;
  topicDescription: string;
  horizontalSections: {
    imageUrl: string;
    header: string;
    duration: string;
    description: string;
  }[];
}

interface Portrait3HorizontalProps {
  content?: Partial<Portrait3HorizontalContent>;
  onUpdate: (newContent: Portrait3HorizontalContent) => void;
}

const defaultContent: Portrait3HorizontalContent = {
  title: '1 Portrait 3 Horizontal',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  topic: 'Topic',
  topicDescription: 'Description',
  horizontalSections: Array(3).fill({
    imageUrl: '',
    header: 'Header',
    duration: 'Duration',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra vulputate sit elit velit in elit tellus pellentesque. Ut non nulla facilisi facilisis faucibus.',
  }),
};

const Portrait3Horizontal: React.FC<Portrait3HorizontalProps> = ({ content = {}, onUpdate }) => {
  const [isImageUploadOpen, setIsImageUploadOpen] = useState<number | null>(null);
  const currentContent = { ...defaultContent, ...content, horizontalSections: [...(content.horizontalSections || defaultContent.horizontalSections)] };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const newHorizontalSections = [...currentContent.horizontalSections];
      newHorizontalSections[index] = { ...newHorizontalSections[index], [name]: value };
      onUpdate({ ...currentContent, horizontalSections: newHorizontalSections });
    } else {
      onUpdate({ ...currentContent, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newHorizontalSections = [...currentContent.horizontalSections];
        newHorizontalSections[index] = { ...newHorizontalSections[index], imageUrl: event.target?.result as string };
        onUpdate({ ...currentContent, horizontalSections: newHorizontalSections });
      };
      reader.readAsDataURL(file);
    }
    setIsImageUploadOpen(null);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <Input
        name="title"
        value={currentContent.title}
        onChange={handleInputChange}
        placeholder="1 Portrait 3 Horizontal"
        className="text-3xl font-bold mb-4"
      />
      <Textarea
        name="description"
        value={currentContent.description}
        onChange={handleInputChange}
        placeholder="Enter description"
        className="mb-8"
      />
      
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-4">
          <Input
            name="topic"
            value={currentContent.topic}
            onChange={handleInputChange}
            placeholder="Topic"
            className="font-bold"
          />
          <Textarea
            name="topicDescription"
            value={currentContent.topicDescription}
            onChange={handleInputChange}
            placeholder="Description"
          />
        </div>
        
        <div className="col-span-2 space-y-8">
          {currentContent.horizontalSections.map((section, index) => (
            <div key={index} className="flex space-x-4">
              <div className="w-1/3 relative">
                {section.imageUrl ? (
                  <Image
                    src={section.imageUrl}
                    alt={`Image ${index + 1}`}
                    width={200}
                    height={150}
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-36 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <Button
                  onClick={() => setIsImageUploadOpen(index)}
                  className="absolute bottom-2 right-2 text-xs"
                >
                  Upload
                </Button>
              </div>
              <div className="w-2/3 space-y-2">
                <div className="flex justify-between">
                  <Input
                    name="header"
                    value={section.header}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Header"
                    className="font-bold w-2/3"
                  />
                  <Input
                    name="duration"
                    value={section.duration}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Duration"
                    className="w-1/3"
                  />
                </div>
                <Textarea
                  name="description"
                  value={section.description}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="Description"
                  className="text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {isImageUploadOpen !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, isImageUploadOpen)} />
            <Button onClick={() => setIsImageUploadOpen(null)} className="mt-2">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portrait3Horizontal;