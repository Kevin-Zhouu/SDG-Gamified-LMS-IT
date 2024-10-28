import React from 'react';
import Image from 'next/image';
import { Target } from '@/types/infographics';
import TargetCard from './TargetCard';

interface TargetsSectionProps {
  title: string;
  subtitle: string;
  targets: Target[];
  iconSrc?: string;
}

export const TargetsSection: React.FC<TargetsSectionProps> = ({
  title = "The Targets",
  subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  targets,
  iconSrc = "/path-to-default-icon.png"
}) => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 mb-4 relative">
            <Image
              src={iconSrc}
              alt="Target icon"
              width={64}
              height={64}
            />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-black">{title}</h2>
          <p className="text-gray-600 text-center max-w-2xl">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {targets.map((target) => (
            <div key={target.number} className="h-[25rem] flex items-center justify-center">
              <TargetCard
                number={target.number}
                title={target.title}
                description={target.description}
                href={`/target/${target.number}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetsSection;