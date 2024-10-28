import React, { useState, useEffect } from "react";
import { QuizSection, Section } from "@/types/sections";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Plus, X } from "lucide-react";

interface QuizSectionComponentProps {
  section: QuizSection;
  onUpdate?: (updatedSection: Section) => void;
  isEditable?: boolean;
}

const QuizSectionComponent: React.FC<QuizSectionComponentProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const [isEditing, setIsEditing] = useState(isEditable);
  const [localSection, setLocalSection] = useState(section);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setLocalSection(section);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [section]);

  useEffect(() => {
    setIsEditing(isEditable);
  }, [isEditable]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, question: e.target.value },
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...localSection.data.options];
    newOptions[index] = value;
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, options: newOptions },
    });
  };

  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, correctAnswer: e.target.value },
    });
  };

  const handleAddOption = () => {
    setLocalSection({
      ...localSection,
      data: {
        ...localSection.data,
        options: [...localSection.data.options, ""],
      },
    });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = localSection.data.options.filter((_, i) => i !== index);
    setLocalSection({
      ...localSection,
      data: { ...localSection.data, options: newOptions },
    });
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(localSection);
    }
    setIsEditing(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(null);
  };

  const handleComplete = () => {
    if (selectedAnswer === localSection.data.correctAnswer) {
      setIsCorrect(true);
      // localSection.onComplete();
    } else {
      setIsCorrect(false);
    }
  };

  const renderEditMode = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Edit Quiz Question</h3>
      <Textarea
        value={localSection.data.question}
        onChange={handleQuestionChange}
        className="w-full mb-4 p-2 border rounded"
        placeholder="Enter question"
      />
      {localSection.data.options.map((option, index) => (
        <div key={index} className="flex mb-2">
          <Input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="flex-grow mr-2 p-2 border rounded"
            placeholder={`Option ${index + 1}`}
          />
          <Button onClick={() => handleRemoveOption(index)} variant="secondary">
            <X size={16} />
          </Button>
        </div>
      ))}
      <Button onClick={handleAddOption} variant="secondary" className="mb-4">
        <Plus size={16} className="mr-2" /> Add Option
      </Button>
      <Select
        value={localSection.data.correctAnswer}
        onChange={handleCorrectAnswerChange}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select correct answer</option>
        {localSection.data.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Select>
      <Button onClick={handleSave} variant="primary" className="w-full">
        Save Changes
      </Button>
    </div>
  );

  const renderViewMode = () => (
    <div
      className={`bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between min-h-[468px] ${
        isCorrect === false ? "animate-shake" : ""
      }`}
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
        <p className="text-[20px] leading-[32.5px] mb-8 text-[#282e3e]">
          {localSection.data.question}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {localSection.data.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`text-left p-4 border-2 rounded-lg flex items-center text-[#2e3856] cursor-pointer transition-colors ${
              selectedAnswer === option
                ? isCorrect === null
                  ? "bg-blue-100"
                  : option === localSection.data.correctAnswer
                  ? "bg-green-100 border-green-500"
                  : "bg-red-100 border-red-500"
                : "border-[#edeff4] hover:bg-gray-50"
            }`}
          >
            <span className="mr-4 text-sm font-semibold text-[#939bb4]">
              {index + 1}
            </span>
            {option}
          </button>
        ))}
      </div>

      {selectedAnswer && (
        <button
          onClick={handleComplete}
          disabled={isCorrect !== null}
          className="w-full mt-6 py-3 rounded-md text-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {isCorrect === false ? "Try Again" : "Submit Answer"}
        </button>
      )}

      {isEditable && (
        <Button
          onClick={() => setIsEditing(true)}
          variant="secondary"
          className="mt-4"
        >
          Edit Question
        </Button>
      )}
    </div>
  );

  return isEditing ? renderEditMode() : renderViewMode();
};

export default QuizSectionComponent;
