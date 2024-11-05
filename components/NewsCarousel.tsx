'use client';

import { useState } from 'react';
import NewsCard from './NewsCard'; // Adjust path based on your setup

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

interface NewsCarouselProps {
  articles: Article[];
}

const NewsCarousel = ({ articles }: NewsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalArticles = 10;

  // Ensure exactly 10 articles
  const displayedArticles = articles.slice(0, totalArticles);

  // Handle Next Page - Loop to the beginning if at the end
  const nextPage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % totalArticles);
  };

  // Handle Previous Page - Loop to the end if at the beginning
  const prevPage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0 ? totalArticles - itemsPerPage : prevIndex - itemsPerPage
    );
  };

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Left Arrow Button */}
      <button
        onClick={prevPage}
        className="btn-secondary absolute left-0 z-10"
      >
        ◀
      </button>

      {/* News Cards with animation */}
      <div className="overflow-hidden w-full max-w-5xl">
        <div
          className="flex transition-transform duration-500 ease-in-out" // Add Tailwind CSS transition class
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`, // Move carousel left/right
          }}
        >
          {displayedArticles.map((article, index) => (
            <div className="w-1/3 flex-shrink-0 px-4" key={index}>
              <NewsCard
                img={article.urlToImage || '/default-image.jpg'} // Fallback image if none provided
                title={article.title}
                description={article.description}
                href={article.url}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow Button */}
      <button
        onClick={nextPage}
        className="absolute right-0 z-10 btn-secondary"
      >
        ▶
      </button>
    </div>
  );
};

export default NewsCarousel;
