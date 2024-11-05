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
        <X 
          className="w-6 h-6 text-subtler cursor-pointer hover:text-subtle" 
          onClick={() => router.push("/")} 
        />
        <div className="flex-grow mx-6">
          <div className="bg-surface h-3 rounded-full">
            <div
              className="bg-sdg-6 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center">
          <Settings className="w-6 h-6 text-subtler mr-4" />
          <Heart className="w-6 h-6 text-red-400" />
          <span className="ml-1 text-red-400">3</span>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-10">
        {/* Passage section */}
        <div className="bg-surface p-8 rounded-lg">
          <h2 className="text-sdg-6 uppercase caption font-semibold mb-4">
            WATER SUSTAINABILITY
          </h2>
          <p className="leading-relaxed text-default">
            {questions[currentQuestion].question}
          </p>
        </div>

        {/* Quiz section */}
        <div>
          <h5 className="mb-6">
            Select the correct answer(s):
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`py-3 px-6 rounded-full text-center transition-colors ${
                  selectedAnswers.includes(option)
                    ? "bg-sdg-6 text-white"
                    : "bg-surface text-default hover:bg-blue-100"
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
            className={`btn ${
              isAnswered
                ? "btn-primary"
                : "bg-surface text-subtler cursor-not-allowed"
            }`}
            disabled={!isAnswered}
          >
            NEXT
          </button>
        </div>

        {showCongrats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-default p-8 rounded-lg shadow-lg text-center">
              <h2 className="mb-4">Congrats!!</h2>
              <p className="text-default">
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