'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Faucet from '@/public/Faucet.svg';
import WorldWaterDrop from '@/public/WorldWaterDrop.png';
import NavBar from '@/components/info/navbar/Navbar';
import EmptyWell from '@/public/EmptyWell.svg';
import FilledWell from '@/public/FilledWell.svg';

const sections = [
  { id: 'header-section', title: 'Header', defaultImage: EmptyWell, activeImage: FilledWell },
  { id: 'targets-section', title: 'Targets', defaultImage: EmptyWell, activeImage: FilledWell },
  { id: 'quiz-section', title: 'Quiz', defaultImage: EmptyWell, activeImage: FilledWell },
  { id: 'game-section', title: 'Game', defaultImage: EmptyWell, activeImage: FilledWell },
];

const WaterDropScroll: React.FC<{ targetSectionId: string }> = ({ targetSectionId }) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const newScrollPercentage = (currentScroll / totalHeight) * 100;
      setScrollPercentage(newScrollPercentage);
      
      // Determine active section
      const newActiveSection = sections.findIndex((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        }
        return false;
      });
      if (newActiveSection !== -1) {
        setActiveSection(newActiveSection);
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <>
      <NavBar 
        sections={sections} 
        activeSection={activeSection} 
        scrollPercentage={scrollPercentage} 
      />
    </>
  );
};

export default WaterDropScroll;