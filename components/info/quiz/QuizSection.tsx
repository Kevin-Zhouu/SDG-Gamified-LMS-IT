import React, { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import CelebrationAnimation from "@/public/celebrate.json";
import { QuizSection } from "@/types/sections";
const QuizSectionComponent: React.FC<{ section: QuizSection }> = ({
  section,
}) => {
  /* @ts-ignore */
  const { data, onComplete } = section;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Track correctness
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(null); // Reset correctness on new selection
  };

  const handleComplete = () => {
    if (selectedAnswer === data.correctAnswer) {
      setIsCorrect(true);
      setShowCelebration(true); // Show celebration animation
      setTimeout(() => {
        setShowCelebration(false); // Hide celebration animation after some time
        onComplete();
      }, 2000);
    } else {
      setIsCorrect(false); // Show incorrect feedback
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between min-h-[468px] ${
        isCorrect === false ? "animate-shake" : "" // Shake animation on incorrect
      }`}
      style={{ boxShadow: "rgba(40, 46, 62, 0.12) 0px 4px 16px 0px" }}
    >
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed top-0 left-0 right-0 flex justify-center z-[902]">
          <Player
            autoplay
            src={CelebrationAnimation}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-[#586380]">
            {section.order_id + ". " + section.title}
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
          {data.question}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {data.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`text-left p-4 border-2 rounded-lg flex items-center text-[#2e3856] cursor-pointer transition-colors ${
              selectedAnswer === option
                ? isCorrect === null
                  ? "bg-blue-100" // Highlight selected option initially
                  : option === data.correctAnswer
                  ? "bg-green-100 border-green-500" // Green on correct
                  : "bg-red-100 border-red-500" // Red on incorrect
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
          disabled={isCorrect !== null} // Disable if already answered
          className="w-full mt-6 py-3 rounded-md text-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          {isCorrect === false ? "Try Again" : "Submit Answer"}
        </button>
      )}
    </div>
  );
};

export default QuizSectionComponent;
