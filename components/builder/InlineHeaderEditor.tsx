'use client';
import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/Label';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { HeaderData } from '@/types/infographics';
import { AlertTriangle, Upload } from 'lucide-react';
import Image from 'next/image';

interface InlineHeaderEditorProps {
  initialData: HeaderData;
  onUpdate: (data: HeaderData) => void;
}

const InlineHeaderEditor: React.FC<InlineHeaderEditorProps> = ({ initialData, onUpdate }) => {
  const [headerData, setHeaderData] = useState<HeaderData>(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = { ...headerData, [name]: value };
    setHeaderData(newData);
    onUpdate(newData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newData = { ...headerData, illustrationComponent: e.target?.result as string };
        setHeaderData(newData);
        onUpdate(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className={`${headerData.backgroundColor} p-8 relative`}>
      <div className={`${headerData.newsBannerColor} p-4 rounded-lg mb-8 relative`}>
        <div className="flex items-center">
          <AlertTriangle className="text-black mr-2" />
          <Input
            name="newsTitle"
            value={headerData.newsTitle}
            onChange={handleInputChange}
            className="font-bold bg-transparent text-black"
            placeholder="Enter news title"
          />
        </div>
        <Textarea
          name="newsContent"
          value={headerData.newsContent}
          onChange={handleInputChange}
          className="text-sm mt-2 bg-transparent text-black w-full"
          placeholder="Enter news content"
        />
      </div>
     
      <div className="flex justify-between items-start">
        <div className="text-white max-w-2xl">
          <Input
            name="mainTitle"
            value={headerData.mainTitle}
            onChange={handleInputChange}
            className="text-6xl font-bold mb-4 bg-transparent text-white"
            placeholder="Enter main title"
          />
          <Input
            name="mainSubtitle"
            value={headerData.mainSubtitle}
            onChange={handleInputChange}
            className="text-xl bg-transparent text-white"
            placeholder="Enter main subtitle"
          />
        </div>
        <div className="relative w-1/3">
          {headerData.illustrationComponent ? (
            <Image
              src={headerData.illustrationComponent as string}
              alt="Header illustration"
              width={300}
              height={300}
              className="rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image uploaded</span>
            </div>
          )}
          <Button
            onClick={triggerFileInput}
            className="absolute bottom-2 right-2 bg-white text-black p-2 rounded-full"
          >
            <Upload size={20} />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <div className="absolute top-2 right-2 space-x-2">
        <Select
          name="backgroundColor"
          value={headerData.backgroundColor}
          onChange={handleInputChange}
          className="bg-white text-black"
        >
          <option value="bg-blue-500">Blue</option>
          <option value="bg-green-500">Green</option>
          <option value="bg-red-500">Red</option>
          <option value="bg-purple-500">Purple</option>
        </Select>
        <Select
          name="newsBannerColor"
          value={headerData.newsBannerColor}
          onChange={handleInputChange}
          className="bg-white text-black"
        >
          <option value="bg-orange-300">Orange</option>
          <option value="bg-yellow-300">Yellow</option>
          <option value="bg-green-300">Green</option>
          <option value="bg-blue-300">Blue</option>
        </Select>
      </div>
    </section>
  );
};

export default InlineHeaderEditor;