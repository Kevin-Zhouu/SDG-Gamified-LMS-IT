'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Faucet from '@/public/Faucet.svg';
import WorldWaterDrop from '@/public/WorldWaterDrop.png';

const WaterDropScroll: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.pageYOffset;
      const newScrollPercentage = (currentScroll / totalHeight) * 100;
      setScrollPercentage(newScrollPercentage);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  const dropPosition = `${Math.min(scrollPercentage, 100)}%`;

  return (
    <div className="fixed left-0 top-0 h-full w-16 z-50 pointer-events-none">
      <div style={{ position: 'absolute', top: '0', left: '0' }}>
        <Image src={Faucet} alt="Faucet" width={50} height={50} />
      </div>
      <div 
        style={{ 
          position: 'absolute', 
          top: dropPosition, 
          left: '0', 
          transition: 'top 0.1s',
          transform: 'translateY(-50%)' // Center the drop vertically
        }}
      >
        <Image src={WorldWaterDrop} alt="World Water Drop" width={50} height={50} />
      </div>
    </div>
  );
};

export default WaterDropScroll;