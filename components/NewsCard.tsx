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
    <div className="flex flex-col items-center h-full w-[280px] justify-start px-3 py-4 rounded-lg gap-5 bg-white shadow-lg">
      <div className="relative w-full h-[150px] overflow-hidden rounded-lg">
        <Image
          src={img}
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      <div className="flex flex-col flex-grow mt-5">
        <div className="flex flex-col gap-2">
          <h6 className="text-s text-center line-clamp-3">{title}</h6>
          <p className="text-xs text-center line-clamp-4">{description}</p>
        </div>
      </div>
      <div className="mt-auto pt-4">
          <a href={href}>
            <button className='btn-outline btn-sm'>Learn more</button>
            </a>
        </div>
    </div>
  );
}
