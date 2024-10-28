import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";

interface CardData {
  id: number;
  concept: string;
  details: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface FlashcardGameProps {
  title: string;
  cardPairs: { id: number; concept: string; details: string }[];
}

const FlashcardGame: React.FC<FlashcardGameProps> = ({ title, cardPairs }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  useEffect(() => {
    initializeCards();
  }, [cardPairs]);

  const initializeCards = () => {
    const shuffledCards = [...cardPairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
  };

  const handleCardClick = (id: number) => {
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      if (cards[firstCardId].concept === cards[secondCardId].concept) {
        // Match found
        newCards[firstCardId].isMatched = true;
        newCards[secondCardId].isMatched = true;
        setCards(newCards);
      }
      setFlippedCards([]);
    }
  };

  const resetGame = () => {
    initializeCards();
  };

  return (
    <section className="flashcard-game bg-gradient-to-br from-blue-100 to-green-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`aspect-square cursor-pointer transition-transform duration-700 transform ${
              card.isFlipped ? "rotate-y-0" : "rotate-y-180"
            } relative bg-white shadow-lg rounded-lg flex items-center justify-center text-xl p-4 hover:shadow-2xl ${
              card.isMatched ? "bg-green-200" : ""
            } ${card.isFlipped ? "border-4 border-green-400" : ""}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div
              className={`absolute w-full h-full flex items-center justify-center text-center p-4 transition-opacity duration-500 ${
                card.isFlipped ? "opacity-100" : "opacity-0"
              }`}
            >
              {card.details}
              {card.isMatched && (
                <FaCheck className="text-green-500 text-3xl absolute top-4 right-4 animate-pulse" />
              )}
            </div>
            <div
              className={`absolute w-full h-full bg-blue-300 flex items-center justify-center rounded-lg text-center p-4 transition-opacity duration-500 ${
                card.isFlipped ? "opacity-0" : "opacity-100"
              }`}
            >
              {card.concept}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
          onClick={resetGame}
        >
          Reset Flashcards
        </button>
      </div>
    </section>
  );
};

export default FlashcardGame;
