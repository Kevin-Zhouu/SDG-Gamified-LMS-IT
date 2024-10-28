import React from 'react';
import Image from 'next/image';

interface NewsCardProps {
  img: string;
  title: string;
  description: string;
  href: string;
}

export default function NewsCard({ img, title, description, href }: NewsCardProps) {
  return (
    <div className="flex flex-col items-center h-full w-[280px] justify-center px-3 py-4 rounded-lg gap-5 bg-white shadow-lg">
      {/* Image container */}
      <div className="relative w-[280px] h-[160px] overflow-hidden rounded-lg">
        {/* Ensure image is consistently displayed with object-cover */}
        <Image
          src={img}
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-s text-center font-[Poppins]">{title}</h3>
        <p className="text-xs text-center font-[Poppins]">{description}</p>
      </div>

      <a href={href}>
        <div className="flex flex-row w-fit items-center bg-[#CCE0FF] rounded-full px-3 py-1 hover:bg-[#85B8FF]">
          <p className="text-black text-xs font-[Poppins] self-center text-center">Learn more</p>
          <img
            src="./icon_chevron-right.svg"
            alt="right facing chevron icon"
          />
        </div>
      </a>
    </div>
  );
}
