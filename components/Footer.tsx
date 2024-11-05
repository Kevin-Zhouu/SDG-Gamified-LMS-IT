import Image from 'next/image';
import Link from 'next/link';
import UNiSDGLogo from "@/public/UNiSDG_logo.svg";

export default function Footer() {
  {/* Update Links */ }
  const sdgGoals = [
    { text: "1 NO POVERTY", link: "/sdg/1" },
    { text: "2 ZERO HUNGER", link: "/sdg/2" },
    { text: "3 GOOD HEALTH & WELL-BEING", link: "/sdg/3" },
    { text: "4 QUALITY EDUCATION", link: "/sdg/4" },
    { text: "5 GENDER EQUALITY", link: "/sdg/5" },
    { text: "6 CLEAN WATER & SANITATION", link: "/sdg/6" },
    { text: "7 AFFORDABLE & CLEAN ENERGY", link: "/sdg/7" },
    { text: "8 DECENT WORK & ECONOMIC GROWTH", link: "/sdg/8" },
    { text: "9 INDUSTRY, INNOVATION & INFRASTRUCTURE", link: "/sdg/9" },
    { text: "10 REDUCED INEQUALITY", link: "/sdg/10" },
    { text: "11 SUSTAINABLE CITIES AND COMMUNITIES", link: "/sdg/11" },
    { text: "12 RESPONSIBLE CONSUMPTION AND PRODUCTION", link: "/sdg/12" },
    { text: "13 CLIMATE ACTION", link: "/sdg/13" },
    { text: "14 LIFE BELOW WATER", link: "/sdg/14" },
    { text: "15 LIFE ON LAND", link: "/sdg/15" },
    { text: "16 PEACE, JUSTICE AND STRONG INSTITUTIONS", link: "/sdg/16" },
    { text: "17 PARTNERSHIPS FOR THE GOAL", link: "/sdg/17" },
  ];
    const sdgColumns = [sdgGoals.slice(0, 6), sdgGoals.slice(6, 12), sdgGoals.slice(12)];
    return (
      <footer className="bg-surface p-8 flex flex-col mb-4 mt-8 h-auto">
        <div className="h-60 justify-between items-start inline-flex">
          <div className="w-[140px] flex-col justify-start items-center gap-[26px] inline-flex">
            <div className="flex-col justify-start items-start gap-3 flex">
              <div className="flex-col justify-start items-start gap-2.5 flex">
              <Link href="/" className="flex items-center">
                <Image
                  src={UNiSDGLogo}
                  alt="UNiSDG Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
              </Link>
              </div>
            <h6 className="self-stretch text-center">UNi SDG</h6>
        </div>
      </div>
        <div className="justify-start items-start gap-2 flex h-full">
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            <h6 className="w-[200px] h-6">Contact Us</h6>
            <div className="h-6 flex-col justify-start items-start gap-2 flex">
              <Link href="@emailaddress">
                <p className="self-stretch caption text-default">support@unisdg.com</p>
              </Link>
            </div>
            <h6 className="w-[200px] h-6">Legal</h6>
              <div className="w-[200px] flex-col justify-start items-start gap-2 inline-flex">
                <Link href="/">
                  <p className="self-stretch caption text-default">Terms & Conditions</p>
                </Link>
                <Link href="/">
                  <p className="self-stretch caption text-default">Privacy Policy</p>
                </Link>
              </div>
          </div>
      </div>
      <div className="justify-start items-start gap-4 flex h-full">
        <div className="flex-col justify-start items-start gap-2 inline-flex">
          <h6 className="w-[200px] h-6">SDG</h6>
          <div className="self-stretch h-[0px] border border-default-500"></div> {/* Horizontal line divider */}
          <div className="w-[632px] justify-start items-start gap-4 inline-flex mb-2"> 
              {sdgColumns.map((column, index) => (
                <div key={index} className="w-[200px] flex-col justify-start items-start gap-2 inline-flex">
                  {column.map((goal, goalIndex) => (
                    <Link key={goalIndex} href={goal.link} className="self-stretch caption text-default">
                      {goal.text}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
    <p className="caption"> ©Copyrights All Rights Reserved</p>
  </footer>
    );
  }