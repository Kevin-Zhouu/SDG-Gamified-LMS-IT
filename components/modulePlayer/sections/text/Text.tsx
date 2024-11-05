import React, { useState, useEffect } from "react";
import { TextSection, Section } from "@/types/sections";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface EditableTextSectionComponentProps {
  section: TextSection;
  onUpdate: (updatedSection: Section) => void;
  isEditable?: boolean;
}

const EditableTextSectionComponent: React.FC<
  EditableTextSectionComponentProps
> = ({ section, onUpdate, isEditable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSection, setLocalSection] = useState(section);

  useEffect(() => {
    setLocalSection(section);
  }, [section]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, content: e.target.value },
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
      <h3 className="text-xl font-bold mb-4">Edit Text Section</h3>
      <Input
        type="text"
        value={localSection.title}
        onChange={handleTitleChange}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Section Title"
      />
      <Textarea
        value={localSection.data.content}
        onChange={handleContentChange}
        className="w-full h-64 mb-4 p-2 border rounded"
        placeholder="Enter your content here"
      />
      <Button onClick={handleSave} variant="primary" className="w-full">
        Save Changes
      </Button>
    </div>
  );

  const renderViewMode = () => (
    <div
      className="bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between min-h-[468px]"
      style={{ boxShadow: "rgba(40, 46, 62, 0.12) 0px 4px 16px 0px" }}
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-[#586380]">
            {localSection.order_id + ". " + localSection.title}
          </span>
          <div className="flex items-center">
            <button className="p-1 bg-gray-200 rounded-full mr-2">
              <svg
                className="w-4 h-4 text-[#586380]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828"
                />
              </svg>
            </button>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
              Let's try again
            </span>
          </div>
        </div>
        <p
          className="text-[20px] leading-[32.5px] mb-8 text-[#282e3e]"
          style={{ WebkitFontSmoothing: "antialiased" }}
        >
          {localSection.data.content}
        </p>
      </div>
      <Button
        // onClick={localSection.onComplete}
        variant="primary"
        className="w-full"
      >
        Continue
      </Button>
      {isEditable && (
        <Button
          onClick={() => setIsEditing(true)}
          variant="secondary"
          className="mt-4"
        >
          Edit Section
        </Button>
      )}
    </div>
  );

  return isEditing ? renderEditMode() : renderViewMode();
};

export default EditableTextSectionComponent;
