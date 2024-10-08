"use client";
import React, { useState } from "react";
import { X, Settings, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const router = useRouter();
  const questions = [
    {
      type: "single",
      question:
        "Ensuring access to clean water requires effective ______ strategies.",
      correctAnswers: ["conservation"],
      options: ["conservation", "pollution", "scarcity", "recycling"],
    },
    {
      type: "single",
      question:
        "One approach is ______ harvesting, which collects and stores rainwater for various uses.",
      correctAnswers: ["rainwater"],
      options: ["rainwater", "groundwater", "wastewater", "treatment"],
    },
    {
      type: "multiple",
      question:
        "Select all that apply: Managing water resources efficiently can address growing water scarcity concerns.",
      correctAnswers: ["efficiently", "scarcity"],
      options: ["efficiently", "scarcity", "wastewater", "recycling"],
    },
    {
      type: "single",
      question:
        "We must manage our water resources ______ to ensure sustainability.",
      correctAnswers: ["sustainably"],
      options: ["efficiently", "sustainably", "responsibly", "treatment"],
    },
    {
      type: "multiple",
      question:
        "Which of the following are important for global water security?",
      correctAnswers: ["conservation", "treatment", "recycling"],
      options: [
        "conservation",
        "treatment",
        "pollution",
        "scarcity",
        "recycling",
      ],
    },
  ];

  const handleAnswerSelect = (answer: string) => {
    if (questions[currentQuestion].type === "single") {
      setSelectedAnswers([answer]);
      setIsAnswered(true);
    } else {
      setSelectedAnswers((prev) => {
        if (prev.includes(answer)) {
          const newSelection = prev.filter((ans) => ans !== answer);
          setIsAnswered(newSelection.length > 0);
          return newSelection;
        } else {
          const newSelection = [...prev, answer];
          setIsAnswered(newSelection.length > 0);
          return newSelection;
        }
      });
    }
    setFeedbackMessage("");
  };

  const handleNext = () => {
    const correct =
      questions[currentQuestion].correctAnswers.sort().join(",") ===
      selectedAnswers.sort().join(",");

    if (correct) {
      setFeedbackMessage("Correct!");
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswers([]);
          setProgress(((currentQuestion + 1) / questions.length) * 100);
          setIsAnswered(false);
          setFeedbackMessage("");
        } else {
          setShowCongrats(true);
        }
      }, 1000);
    } else {
      setFeedbackMessage("Incorrect. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-12">
        <X className="w-6 h-6 text-gray-400" onClick={() => router.push("/")} />
        <div className="flex-grow mx-6">
          <div className="bg-gray-200 h-3 rounded-full">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-gray-400 mr-4" />
          <Heart className="w-6 h-6 text-red-400" />
          <span className="ml-1 text-red-400">3</span>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-10">
        {/* Passage section */}
        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-blue-700 uppercase text-sm font-semibold mb-4">
            WATER SUSTAINABILITY
          </h2>
          <p className="text-base leading-relaxed">
            {questions[currentQuestion].question}
          </p>
        </div>

        {/* Quiz section */}
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Select the correct answer(s):
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`py-3 px-6 rounded-full text-center transition-colors ${
                  selectedAnswers.includes(option)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {feedbackMessage && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">{feedbackMessage}</p>
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            onClick={handleNext}
            className={`px-8 py-3 rounded-full text-lg font-medium transition-colors ${
              isAnswered
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!isAnswered}
          >
            NEXT
          </button>
        </div>

        {showCongrats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Congrats!!</h2>
              <p className="text-lg">
                You've completed the quiz on water sustainability!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
