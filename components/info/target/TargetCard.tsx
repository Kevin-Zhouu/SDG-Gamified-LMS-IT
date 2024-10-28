import React from 'react';
import Image from 'next/image';
import { PinContainer } from '@/components/info/ui/3d-pin';

interface TargetCardProps {
  number: string;
  title: string;
  description: string;
  href?: string;
}

export const TargetCard: React.FC<TargetCardProps> = ({ number, title, description, href = "/" }) => (
  <PinContainer title={`TARGET ${number}`} href={href}>
    <div className="flex flex-col items-center text-center w-[20rem] h-[20rem] p-4">
      <div className="w-16 h-16 mb-4 relative">
        <Image
          src="/api/placeholder/64/64"
          alt={`Target ${number} icon`}
          width={64}
          height={64}
        />
      </div>
      <h3 className="text-sm text-black mb-2">TARGET {number}</h3>
      <h4 className="text-lg text-black font-bold mb-2">{title}</h4>
      <p className="text-black text-sm">{description}</p>
    </div>
  </PinContainer>
);

export default TargetCard;