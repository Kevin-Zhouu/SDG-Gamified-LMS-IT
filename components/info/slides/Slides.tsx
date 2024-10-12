import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Target {
  id: string;
  title: string;
  description: string;
}

interface CarouselProps {
  targets: Target[];
  icons: { [key: string]: string };
}

const SDG6Carousel: React.FC<CarouselProps> = ({ targets, icons }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [readProgress, setReadProgress] = useState<number>(0);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const readingTime = 5000; // 5 seconds per slide, adjust as needed

  const resetTimer = useCallback(() => {
    setReadProgress(0);
    setCanProceed(false);
  }, []);

  useEffect(() => {
    let timer: number;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / readingTime) * 100, 100);
      setReadProgress(newProgress);

      if (newProgress < 100) {
        timer = requestAnimationFrame(updateProgress);
      } else {
        setCanProceed(true);
      }
    };

    timer = requestAnimationFrame(updateProgress);

    return () => {
      if (timer) {
        cancelAnimationFrame(timer);
      }
    };
  }, [currentIndex, readingTime]);

  const nextSlide = () => {
    if (canProceed && currentIndex < targets.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      resetTimer();
    }
  };

  const slideVariants = {
    enter: { x: "100%", opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-100 to-blue-300 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute w-4/5 h-3/4 bg-white rounded-lg shadow-xl p-8 flex flex-col"
          >
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Target {targets[currentIndex].id}:{" "}
              {icons[targets[currentIndex].id]}
            </motion.div>
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl mb-6"
            >
              {targets[currentIndex].title}
            </motion.div>
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex-grow text-lg overflow-y-auto mb-6"
            >
              {targets[currentIndex].description}
            </motion.div>
            <motion.button
              onClick={nextSlide}
              disabled={!canProceed}
              whileHover={canProceed ? { scale: 1.05 } : {}}
              whileTap={canProceed ? { scale: 0.95 } : {}}
              className={`self-end px-4 py-2 rounded-full flex items-center ${
                canProceed
                  ? "bg-blue-500 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next <ArrowRight className="ml-2" size={16} />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-4/5">
        <div className="bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-blue-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${readProgress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {targets.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SDG6Carousel;
