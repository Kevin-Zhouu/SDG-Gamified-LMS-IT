import React, {useState} from 'react';
import Image from 'next/image';


{/* SDG Type checking */}
type SDG = {
    src: string;
    alt: string;
  };
  
  interface SDGGridProps {
    onSelectGoal: (goal: { number: number }) => void;
  }
// Array of SDG image paths
const sdgImages = [
  { src: '/SDG-Grid-Logos/SDG-01.svg', alt: 'SDG 1: No Poverty' },
  { src: '/SDG-Grid-Logos/SDG-02.svg', alt: 'SDG 2: Zero Hunger' },
  { src: '/SDG-Grid-Logos/SDG-03.svg', alt: 'SDG 3: Good Health and Well-being' },
  { src: '/SDG-Grid-Logos/SDG-04.svg', alt: 'SDG 4: Quality Education' },
  { src: '/SDG-Grid-Logos/SDG-05.svg', alt: 'SDG 5: Gender Equality' },
  { src: '/SDG-Grid-Logos/SDG-06.svg', alt: 'SDG 6: Clean Water and Sanitation' },
  { src: '/SDG-Grid-Logos/SDG-07.svg', alt: 'SDG 7: Affordable and Clean Energy' },
  { src: '/SDG-Grid-Logos/SDG-08.svg', alt: 'SDG 8: Decent Work and Economic Growth' },
  { src: '/SDG-Grid-Logos/SDG-09.svg', alt: 'SDG 9: Industry, Innovation, and Infrastructure' },
  { src: '/SDG-Grid-Logos/SDG-10.svg', alt: 'SDG 10: Reduced Inequalities' },
  { src: '/SDG-Grid-Logos/SDG-11.svg', alt: 'SDG 11: Sustainable Cities and Communities' },
  { src: '/SDG-Grid-Logos/SDG-12.svg', alt: 'SDG 12: Responsible Consumption and Production' },
  { src: '/SDG-Grid-Logos/SDG-13.svg', alt: 'SDG 13: Climate Action' },
  { src: '/SDG-Grid-Logos/SDG-14.svg', alt: 'SDG 14: Life Below Water' },
  { src: '/SDG-Grid-Logos/SDG-15.svg', alt: 'SDG 15: Life on Land' },
  { src: '/SDG-Grid-Logos/SDG-16.svg', alt: 'SDG 16: Peace, Justice, and Strong Institutions' },
  { src: '/SDG-Grid-Logos/SDG-17.svg', alt: 'SDG 17: Partnerships for the Goals' }
];

const SDGGrid: React.FC<SDGGridProps> = ({ onSelectGoal }) => {
  return (
    <div className="w-[600px] grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5">
      {sdgImages.map((sdg, index) => (
        <div
          key={index}
          className="w-fit flex flex-col items-center text-center rounded-lg hover:shadow-[0px_4px_15px_rgba(255,255,255,1)] transition-shadow duration-300"
          onClick={() => onSelectGoal({ number: index + 1 })}
        >
          <Image
            src={sdg.src}
            alt={sdg.alt}
            width={85}
            height={85}
            className="h-fit rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default SDGGrid;