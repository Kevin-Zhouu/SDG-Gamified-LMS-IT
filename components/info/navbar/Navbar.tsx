import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Faucet from '@/public/Faucet.svg';
import WorldWaterDrop from '@/public/WorldWaterDrop.png';

interface NavBarProps {
  sections: {
    id: string;
    title: string;
    defaultImage: string | StaticImageData;
    activeImage: string | StaticImageData;
  }[];
  activeSection: number;
  scrollPercentage: number;
}

const NavBar: React.FC<NavBarProps> = ({ sections, activeSection, scrollPercentage }) => {
  const baseSize = 16; // Base size in pixels
  const navWidth = baseSize * 10; // 160px
  const sectionHeight = baseSize * 3; // 48px
  const iconSize = baseSize * 1.5; // 24px
  const faucetSize = baseSize * 2.5; // 40px
  const dropSize = baseSize * 2; // 32px

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navbarHeight = sections.length * sectionHeight;
  const dropPosition = `${Math.min(scrollPercentage / 100 * navbarHeight, navbarHeight)}px`;

  return (
    <nav className={`fixed left-0 top-0 h-full w-${navWidth / 4} bg-gray-100 p-2 z-40 flex flex-col`}>
      <div className={`relative mb-2 h-${faucetSize / 4}`}>
        <Image src={Faucet} alt="Faucet" width={faucetSize} height={faucetSize} className="absolute left-2 top-0" />
      </div>
      <div className="relative flex-grow">
        <ul className="relative z-10">
          {sections.map((section, index) => (
            <li
              key={index}
              className={`mb-2 p-2 rounded transition-colors duration-300 flex items-center cursor-pointer ${
                activeSection >= index ? 'bg-blue-500 text-white' : 'bg-yellow-200 text-gray-800'
              }`}
              onClick={() => handleClick(section.id)}
              style={{ height: `${sectionHeight}px` }}
            >
              <div className={`w-${iconSize / 4} h-${iconSize / 4} mr-2 relative`}>
                <Image
                  src={activeSection >= index ? section.activeImage : section.defaultImage}
                  alt={`${section.title} icon`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className="text-sm font-medium">{section.title}</span>
            </li>
          ))}
        </ul>
        <div
          style={{
            position: 'absolute',
            top: dropPosition,
            left: `${baseSize / 2}px`,
            transition: 'top 0.1s',
            zIndex: 20
          }}
        >
          {/* <Image src={WorldWaterDrop} alt="World Water Drop" width={dropSize} height={dropSize} /> */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;