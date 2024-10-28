import React, { useState, useEffect } from "react";
import { FlashcardGameSection, Section } from "@/types/sections";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Plus, X } from "lucide-react";

interface FlashCard {
  id: number;
  concept: string;
  details: string;
  isFlipped: boolean;
}

interface EditableFlashcardGameComponentProps {
  section: FlashcardGameSection;
  onUpdate: (updatedSection: Section) => void;
}

const EditableFlashcardGameComponent: React.FC<EditableFlashcardGameComponentProps> = ({
  section,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSection, setLocalSection] = useState(section);
  const [cards, setCards] = useState<FlashCard[]>(
    section.data.cardPairs.map((card, index) => ({
      ...card,
      id: card.id || index,
      isFlipped: false,
    }))
  );

  useEffect(() => {
    setLocalSection(section);
    setCards(section.data.cardPairs.map((card, index) => ({
      ...card,
      id: card.id || index,
      isFlipped: false,
    })));
  }, [section]);

  const handleCardClick = (id: number) => {
    if (!isEditing) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
        )
      );
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSection({ ...localSection, title: e.target.value });
  };

  const handleCardChange = (id: number, field: 'concept' | 'details', value: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleAddCard = () => {
    const newCard: FlashCard = { id: cards.length, concept: '', details: '', isFlipped: false };
    setCards([...cards, newCard]);
  };

  const handleRemoveCard = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleSave = () => {
    const updatedSection: FlashcardGameSection = {
      ...localSection,
      data: { 
        ...localSection.data, 
        cardPairs: cards.map(({ id, concept, details }) => ({ id, concept, details }))
      },
    };
    onUpdate(updatedSection);
    setIsEditing(false);
  };

  const renderEditMode = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">

      <Input
        type="text"
        value={localSection.title}
        onChange={handleTitleChange}
        className="w-full text-2xl font-bold mb-4 p-2 border rounded"
        placeholder="Flashcard Set Title"
      />
      {cards.map((card) => (
        <div key={card.id} className="mb-4 p-4 border rounded">
          <Input
            type="text"
            value={card.concept}
            onChange={(e) => handleCardChange(card.id, 'concept', e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            placeholder="Concept"
          />
          <Textarea
            value={card.details}
            onChange={(e) => handleCardChange(card.id, 'details', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Details"
          />
          <Button 
            onClick={() => handleRemoveCard(card.id)}
            variant="secondary"
            className="mt-2"
          >
            <X size={16} className="mr-2" /> Remove Card
          </Button>
        </div>
      ))}
      <Button 
        onClick={handleAddCard}
        variant="secondary"  // Changed from "outline" to "secondary"
        className="mb-4"
      >
        <Plus size={16} className="mr-2" /> Add Card
      </Button>
      <Button 
        onClick={handleSave}
        variant="primary"  // Added variant="primary"
        className="w-full"
      >
        Save Changes
      </Button>
    </div>
  );

  const renderViewMode = () => (
    <section className="flashcard-game bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-10 text-center text-blue-800">
        {localSection.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`relative w-full h-64 cursor-pointer transition-all duration-300 transform ${
              card.isFlipped ? "rotate-y-180" : ""
            } rounded-xl flex items-center justify-center bg-white hover:scale-105 hover:shadow-xl`}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            {/* Front Side */}
            <div
              className={`absolute w-full h-full flex items-center justify-center text-center p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white backface-hidden ${
                card.isFlipped ? "opacity-0" : "opacity-100"
              } transition-opacity duration-700`}
            >
              <p className="text-lg font-medium leading-tight">
                {card.concept}
              </p>
            </div>
            {/* Back Side */}
            <div
              className={`absolute w-full h-full flex flex-col items-center justify-between p-6 bg-white text-blue-900 border-2 border-blue-200 rounded-xl backface-hidden ${
                card.isFlipped ? "opacity-100" : "opacity-0"
              } transition-opacity duration-700 transform rotate-y-180`}
            >
              <p className="text-base leading-relaxed flex-grow flex items-center">
                {card.details}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={() => setIsEditing(true)}
        className="mt-4"
      >
        Edit Flashcards
      </Button>
    </section>
  );

  return isEditing ? renderEditMode() : renderViewMode();
};

export default EditableFlashcardGameComponent;