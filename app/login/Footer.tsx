import Image from 'next/image';
import SDG06Icon from '@/public/SDG-Grid-Logos/SDG-06.svg';

export default function Footer() {
    const sdgGoals = [
      "1 NO POVERTY",
      "2 ZERO HUNGER",
      "3 GOOD HEALTH & WELL-BEING",
      "4 QUALITY EDUCATION",
      "5 GENDER EQUALITY",
      "6 CLEAN WATER & SANITATION",
      "7 AFFORDABLE & CLEAN ENERGY",
      "8 DECENT WORK & ECONOMIC GROWTH",
      "9 INDUSTRY, INNOVATION & INFRASTRUCTURE",
      "10 REDUCED INEQUALITY",
      "11 SUSTAINABLE CITIES AND COMMUNITIES",
      "12 RESPONSIBLE CONSUMPTION AND PRODUCTION",
      "13 CLIMATE ACTION",
      "14 LIFE BELOW WATER",
      "15 LIFE ON LAND",
      "16 PEACE, JUSTICE AND STRONG INSTITUTIONS",
      "17 PARTNERSHIPS FOR THE GOALS"
    ];
 
    return (
      <footer className="bg-white p-8">
        <div className="flex items-center mb-6">
          <Image src={SDG06Icon} alt="SDG Icon" width={48} height={48} className="mr-4" />
          <div>
            <h2 className="font-bold">SDG - Clean Water & Sanitation</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {sdgGoals.map((goal, index) => (
            <div key={index}>{goal}</div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">©Copyrights All Rights Reserved</p>
      </footer>
    );
  }