import React, { useState } from 'react';
import { Section } from '@/types/sections';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SectionCarouselProps {
  sectionTypes: Omit<Section, 'id' | 'content'>[];
  onSelect: (section: Omit<Section, 'id' | 'content'>) => void;
  onClose: () => void;
}

const SectionCarousel: React.FC<SectionCarouselProps> = ({ sectionTypes, onSelect, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sectionTypes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sectionTypes.length) % sectionTypes.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Choose a Section</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {sectionTypes.map((section) => (
                <div key={section.type} className="w-full flex-shrink-0 px-4">
                  <div className="border rounded-lg p-4 h-64 flex flex-col items-center justify-center">
                    <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                    <p className="text-center mb-4">
                      {getDescriptionForSectionType(section.type)}
                    </p>
                    <Button onClick={() => onSelect(section)}>Select</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={prevSlide}
            className="absolute top-1/2 left-0 transform -translate-y-1/2"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            onClick={nextSlide}
            className="absolute top-1/2 right-0 transform -translate-y-1/2"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
        <div className="flex justify-center mt-4">
          {sectionTypes.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function getDescriptionForSectionType(type: Section['type']): string {
  switch (type) {
    case 'quiz':
      return 'Add a quiz section with multiple choice questions';
    case 'text':
      return 'Add a text section for content and explanations';
    case 'resourceManagerGame':
      return 'Add a resource management game section';
    case 'flashcards':
      return 'Add a flashcard game for memorization';
    case 'events':
      return 'Add an events section to showcase important dates';
    default:
      return 'Add a new section to your module';
  }
}

export default SectionCarousel;