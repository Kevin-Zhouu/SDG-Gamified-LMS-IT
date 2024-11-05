import React, { useState } from 'react';
import Image from 'next/image';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface MediumLengthHeadingContent {
  heading: string;
  description: string;
  buttonText: string;
  secondaryButtonText: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
}

interface MediumLengthHeadingProps {
  content?: Partial<MediumLengthHeadingContent>;
  onUpdate: (newContent: MediumLengthHeadingContent) => void;
}

const defaultContent: MediumLengthHeadingContent = {
  heading: '',
  description: '',
  buttonText: '',
  secondaryButtonText: '',
  imageUrl: '',
  imagePosition: 'right',
};

const MediumLengthHeading: React.FC<MediumLengthHeadingProps> = ({ content = {}, onUpdate }) => {
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const currentContent = { ...defaultContent, ...content };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...currentContent, [name]: value });
  };

  const toggleImagePosition = () => {
    onUpdate({ ...currentContent, imagePosition: currentContent.imagePosition === 'left' ? 'right' : 'left' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({ ...currentContent, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
    setIsImageUploadOpen(false);
  };

  const renderContent = () => (
    <div className="flex-1 space-y-4">
      <Input
        name="heading"
        value={currentContent.heading}
        onChange={handleInputChange}
        placeholder="Medium length heading goes here"
        className="text-3xl font-bold"
      />
      <Textarea
        name="description"
        value={currentContent.description}
        onChange={handleInputChange}
        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
        className="text-gray-600"
      />
      <div className="flex space-x-2">
        <Input
          name="buttonText"
          value={currentContent.buttonText}
          onChange={handleInputChange}
          placeholder="Button"
          className="w-24"
        />
        <Input
          name="secondaryButtonText"
          value={currentContent.secondaryButtonText}
          onChange={handleInputChange}
          placeholder="Button"
          className="w-24"
        />
      </div>
    </div>
  );

  const renderImage = () => (
    <div className="flex-1 relative">
      {currentContent.imageUrl ? (
        <Image
          src={currentContent.imageUrl}
          alt="Section image"
          width={400}
          height={300}
          className="object-cover rounded-lg w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No image uploaded</span>
        </div>
      )}
      <Button
        onClick={() => setIsImageUploadOpen(true)}
        className="absolute bottom-2 right-2"
      >
        Upload Image
      </Button>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className={`flex ${currentContent.imagePosition === 'left' ? 'flex-row' : 'flex-row-reverse'} gap-8`}>
        {renderContent()}
        {renderImage()}
      </div>
      <Button onClick={toggleImagePosition} className="mt-4">
        Toggle Image Position
      </Button>
      {isImageUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <Button onClick={() => setIsImageUploadOpen(false)} className="mt-2">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediumLengthHeading;