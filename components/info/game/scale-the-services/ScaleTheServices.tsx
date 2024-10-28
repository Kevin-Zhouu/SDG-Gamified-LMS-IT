import React, { useState, useEffect } from "react";

interface Service {
  name: string;
  current: number;
  target: number;
  icon: string;
  color: string;
}

const ScaleTheServices: React.FC = () => {
  const maxValue = 6;

  const initialServices: Service[] = [
    {
      name: "Drinking Water",
      current: 1,
      target: 6,
      icon: "🚰",
      color: "bg-blue-500",
    },
    {
      name: "Sanitation",
      current: 1,
      target: 5,
      icon: "🚽",
      color: "bg-green-500",
    },
    {
      name: "Hygiene",
      current: 1,
      target: 3,
      icon: "🧤",
      color: "bg-yellow-500",
    },
  ];

  const [services, setServices] = useState<Service[]>(initialServices);
  const [gameState, setGameState] = useState<string>("intro"); // 'intro', 'playing', 'celebration'
  const [animatingService, setAnimatingService] = useState<number | null>(null);

  useEffect(() => {
    if (
      services.every((service) => service.current >= service.target) &&
      gameState === "playing"
    ) {
      setGameState("celebration");
    }
  }, [services, gameState]);

  const restartGame = () => {
    setServices(initialServices);
    setGameState("playing");
  };

  const adjustService = (index: number, amount: number) => {
    setAnimatingService(index);
    const updatedServices = [...services];
    const newValue = Math.max(
      1,
      Math.min(updatedServices[index].current + amount, maxValue)
    );

    const steps = 20;
    const stepSize = (newValue - updatedServices[index].current) / steps;
    let step = 0;

    const animateStep = () => {
      if (step < steps) {
        updatedServices[index].current += stepSize;
        setServices([...updatedServices]);
        step++;
        requestAnimationFrame(animateStep);
      } else {
        updatedServices[index].current = newValue;
        setServices([...updatedServices]);
        setAnimatingService(null);
      }
    };

    requestAnimationFrame(animateStep);
  };

  const ServiceBar: React.FC<{ service: Service; index: number }> = ({
    service,
    index,
  }) => (
    <div className="flex flex-col items-center w-1/3 px-4">
      <div className="text-4xl mb-4">{service.icon}</div>
      <div className="font-bold text-xl mb-2">{service.name}</div>
      <div className="w-full h-80 bg-gray-200 rounded-3xl mb-4 relative overflow-hidden">
        <div
          className={`${service.color} transition-all duration-300 ease-out absolute bottom-0 w-full`}
          style={{ height: `${(service.current / maxValue) * 100}%` }}
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-center p-4">
          <div className="bg-white px-3 py-1 rounded-full">
            Target: {service.target}x
          </div>
          <div className={`${service.color} text-white px-3 py-1 rounded-full`}>
            Current: {service.current.toFixed(1)}x
          </div>
        </div>
        <div
          className="absolute w-full h-1 bg-red-500"
          style={{ bottom: `${(service.target / maxValue) * 100}%` }}
        />
      </div>
      <div className="flex justify-around w-full mb-4">
        <button
          onClick={() => adjustService(index, -1)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
          disabled={service.current <= 1 || animatingService === index}
        >
          -1
        </button>
        <button
          onClick={() => adjustService(index, 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          disabled={service.current >= maxValue || animatingService === index}
        >
          +1
        </button>
        <button
          onClick={() => adjustService(index, 2)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
          disabled={
            service.current >= maxValue - 1 || animatingService === index
          }
        >
          +2
        </button>
      </div>
    </div>
  );

  const IntroPopup: React.FC = () => (
    <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Welcome to Scale the Services: SDG 6 Challenge!
      </h2>
      <p className="mb-4">
        By 2030, our goal is to significantly improve global access to clean
        water and sanitation. In this game, you'll work to scale up three key
        areas of water services:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Drinking Water (Target: 6x current levels)</li>
        <li>Sanitation (Target: 5x current levels)</li>
        <li>Hygiene (Target: 3x current levels)</li>
      </ul>
      <p className="mb-4">
        Click the buttons to increase or decrease service levels. Try to reach
        all targets to meet our 2030 goals!
      </p>
      <button
        onClick={() => setGameState("playing")}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
      >
        Start Game
      </button>
    </div>
  );

  const CelebrationPopup: React.FC = () => (
    <div className="bg-white border-2 border-green-500 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">
        🎉 Congratulations! 🎉
      </h2>
      <p className="mb-4 text-center">
        You've successfully scaled all water services to meet the SDG 6 targets
        for 2030!
      </p>
      <p className="mb-4 text-center">
        Your efforts will greatly improve global access to clean water and
        sanitation, bringing us closer to achieving sustainable development for
        all.
      </p>
      <div className="text-center">
        <button
          onClick={restartGame}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Play Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Scale the Services: SDG 6 Challenge for 2030
      </h1>
      <div className="transition-opacity duration-500 ease-in-out">
        {gameState === "intro" && <IntroPopup />}
        {gameState === "playing" && (
          <div className="flex justify-around mb-6">
            {services.map((service, index) => (
              <ServiceBar key={index} service={service} index={index} />
            ))}
          </div>
        )}
        {gameState === "celebration" && <CelebrationPopup />}
      </div>
    </div>
  );
};

export default ScaleTheServices;
