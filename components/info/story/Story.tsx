import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";

interface Slide {
  headline: string;
  supportingText: string;
  backgroundImage: string;
  lottieAnimation: string;
  alignment: "center" | "left" | "right" | "bottom";
}

interface GameData {
  slides: Slide[];
}

interface SDG6StoryComponentProps {
  game: GameData;
}

const SDG6StoryComponent: React.FC<SDG6StoryComponentProps> = ({ game }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const changeSlide = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < game.slides.length && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(newIndex);
        setIsTransitioning(false);
      }, 300); // Match this with the CSS transition duration
    }
  };

  const renderSlide = (slide: Slide) => {
    return (
      <div className="relative h-full w-full">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.backgroundImage})` }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-full max-w-4xl px-8 py-12">
            <div className="flex items-start space-x-8">
              {/* Lottie Animation */}
              <div className="w-40 h-40 flex-shrink-0">
                <Player
                  autoplay
                  loop
                  src={slide.lottieAnimation}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4 text-white leading-tight">
                  {slide.headline}
                </h2>
                <p className="text-lg text-white leading-relaxed">
                  {slide.supportingText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!game.slides || game.slides.length === 0) {
    return (
      <div className="text-white text-center p-8">No slides available.</div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-900 text-white overflow-hidden">
      {/* Main Content */}
      <div className="h-full relative">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {renderSlide(game.slides[currentSlide])}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-6">
        <button
          onClick={() => changeSlide(currentSlide - 1)}
          disabled={currentSlide === 0 || isTransitioning}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          <ChevronLeft className="inline mr-2" /> Back
        </button>
        <div className="flex space-x-2">
          {game.slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                index === currentSlide ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => changeSlide(index)}
            />
          ))}
        </div>
        <button
          onClick={() => changeSlide(currentSlide + 1)}
          disabled={currentSlide === game.slides.length - 1 || isTransitioning}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Next <ChevronRight className="inline ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SDG6StoryComponent;
