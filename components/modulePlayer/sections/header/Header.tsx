import React, { useState, useEffect } from "react";
import { HeaderSection as HeaderSectionType, Section } from "@/types/sections";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface EditableHeaderSectionComponentProps {
  section: HeaderSectionType;
  onUpdate: (updatedSection: Section) => void;
  isEditable?: boolean;
}

const EditableHeaderSectionComponent: React.FC<EditableHeaderSectionComponentProps> = ({
  section,
  onUpdate,
  isEditable = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSection, setLocalSection] = useState(section);

  useEffect(() => {
    setLocalSection(section);
  }, [section]);

  const handleDataChange = (field: string, value: string) => {
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, [field]: value }
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSection({ ...localSection, title: e.target.value });
  };

  const handleSave = () => {
    onUpdate(localSection);
    setIsEditing(false);
  };

  const renderEditMode = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Edit Header Section</h3>
      <div className="space-y-4">
        <Input
          type="text"
          value={localSection.title}
          onChange={handleTitleChange}
          className="w-full p-2 border rounded"
          placeholder="Section Title"
        />

        {/* Main Content */}
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Main Content</h4>
          <Input
            type="text"
            value={localSection.data.mainTitle}
            onChange={(e) => handleDataChange('mainTitle', e.target.value)}
            className="w-full mb-2"
            placeholder="Main Title"
          />
          <Input
            type="text"
            value={localSection.data.mainSubtitle}
            onChange={(e) => handleDataChange('mainSubtitle', e.target.value)}
            className="w-full"
            placeholder="Main Subtitle"
          />
        </div>

        {/* Definition Section */}
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Definition Section</h4>
          <Input
            type="text"
            value={localSection.data.definitionTitle}
            onChange={(e) => handleDataChange('definitionTitle', e.target.value)}
            className="w-full mb-2"
            placeholder="Definition Title"
          />
          <Textarea
            value={localSection.data.definitionPara}
            onChange={(e) => handleDataChange('definitionPara', e.target.value)}
            className="w-full"
            placeholder="Definition Content"
          />
        </div>

        {/* Colors */}
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Background Color</h4>
          <Input
            type="text"
            value={localSection.data.backgroundColor}
            onChange={(e) => handleDataChange('backgroundColor', e.target.value)}
            className="w-full"
            placeholder="Background Color (e.g., bg-blue-500)"
          />
        </div>
      </div>
      
      <Button onClick={handleSave} variant="primary" className="w-full mt-4">
        Save Changes
      </Button>
    </div>
  );

  const renderViewMode = () => (
    <div className={`rounded-lg shadow-lg overflow-hidden ${localSection.data.backgroundColor}`}>
      {/* Main Content - with increased padding at top */}
      <div className="pt-16 px-12 pb-12 text-white">
        <h1 className="text-5xl font-bold mb-6">{localSection.data.mainTitle}</h1>
        <p className="text-2xl">{localSection.data.mainSubtitle}</p>
      </div>

      {/* Definition Box */}
      <div className="bg-white p-8 mx-8 mb-8 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">{localSection.data.definitionTitle}</h3>
        <p className="text-gray-700 text-lg">{localSection.data.definitionPara}</p>
      </div>

      {isEditable && (
        <div className="p-6 bg-white border-t">
          <Button
            onClick={() => setIsEditing(true)}
            variant="secondary"
            className="w-full"
          >
            Edit Header
          </Button>
        </div>
      )}
    </div>
  );

  return isEditing ? renderEditMode() : renderViewMode();
};

export default EditableHeaderSectionComponent;