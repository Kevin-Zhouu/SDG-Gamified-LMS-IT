import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import NewsIcon from '@/public/Icon-Daily-News.svg';
import { HeaderSection as HeaderSectionType } from '@/types/sections';

export const HeaderSection: React.FC<{ section: HeaderSectionType }> = ({ section }) => {
  const {
    newsTitle,
    newsContent,
    mainTitle,
    mainSubtitle,
    backgroundColor = "bg-blue-500",
    newsBannerColor = "bg-orange-300",
    illustrationComponent,
    definitionTitle,
    definitionPara,
  } = section.data;

  return (
    <section className={`${backgroundColor} p-4 md:p-8 lg:p-12`}>
      {/* News Alert Bar */}
      <div className={`${newsBannerColor} flex flex-col md:flex-row p-4 rounded-lg mb-8 gap-3 transition-all duration-300 hover:shadow-lg`}>
        <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
          <Image src={NewsIcon} alt='news icon' width={48} height={48} className="w-12 h-12" />
        </div>
        <div className="flex-col justify-start items-start gap-2">
          <h2 className="text-black text-xl md:text-2xl font-medium font-['Poppins'] leading-tight">{newsTitle}</h2>
          <p className="text-black text-sm md:text-base font-normal font-['Poppins'] leading-snug">{newsContent}</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 pb-8">
        <div className="flex-col justify-center items-start gap-6 max-w-2xl">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold font-['Poppins'] leading-tight">{mainTitle}</h1>
          <p className="text-white text-xl md:text-2xl font-medium font-['Poppins'] leading-relaxed">{mainSubtitle}</p>
        </div>
        <div className="w-full lg:w-1/2">
          {illustrationComponent}
        </div>
      </div>

      {/* Definition Section, Subheader */}
      <div className="flex-col w-full justify-start items-center gap-6 bg-white py-8 md:py-12 lg:py-16 px-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
        <h2 className="text-center text-black text-2xl md:text-3xl font-medium font-['Poppins'] leading-relaxed mb-4">{definitionTitle}</h2>
        <p className="text-center text-black text-sm md:text-base font-normal font-['Poppins'] leading-relaxed max-w-4xl mx-auto">{definitionPara}</p>
      </div>
    </section>  
  );
};

export default HeaderSection;