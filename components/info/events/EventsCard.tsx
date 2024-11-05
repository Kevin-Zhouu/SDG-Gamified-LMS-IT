import React from 'react';
import Image from 'next/image';


interface EventsCardProps {
    imgSrc: string;
    title: string;
    date: string;
    href?: string;
}

export const EventsCard: React.FC<EventsCardProps> = ({ imgSrc, title, date, href = "/" }) => (
    <div className="max-w-[336px] px-4 py-4 pb-6 rounded flex-col justify-start items-center gap-4 inline-flex bg-white 
                    hover:outline outline-1 outline-[#85B8FF] hover:drop-shadow-xl">
                <Image
                    src={imgSrc}
                    alt="Event Image"
                    width ={336/1.5}
                    height = {340/1.5}
                    />
            <div className="w-[336px] h-[82px] p-4 flex-col justify-start items-center gap-2 flex">
                <h3 className="self-stretch text-center text-black text-xl font-medium font-['Poppins'] leading-normal">{title}</h3>
                <p className="self-stretch text-center text-black text-sm font-normal font-['Poppins'] leading-[18px]">{date}</p>
            </div>
            <button className="btn-outline btn-sm">
                {href && <a href={href} target="_blank" rel="noopener noreferrer">Learn More</a>}
            </button>
    </div>
);

export default EventsCard;