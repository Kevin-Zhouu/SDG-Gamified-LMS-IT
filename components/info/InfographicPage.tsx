'use client';
import React from 'react';
import { HeaderSection } from '@/components/info/header/HeaderSection';
import { TargetsSection } from '@/components/info/target/TargetsSection';
import { QuizSection } from '@/components/info/quiz/QuizSection';
import { ImageMatchingGame } from '@/components/info/game/image-match/ImageMatchingGame';
import CurrentGlobalSituation from '@/components/info/cgs/CurrentGlobalSituation';
import { Target } from '@/types/infographics';

interface QuizQuestion {
  type: "single" | "multiple";
  question: string;
  correctAnswers: string[];
  options: string[];
}

interface InfographicPageProps {
  headerData: {
    newsTitle: string;
    newsContent: string;
    mainTitle: string;
    mainSubtitle: string;
    backgroundColor?: string;
    newsBannerColor?: string;
    illustrationComponent?: React.ReactNode;
  };
  targetsData: {
    title: string;
    subtitle: string;
    targets: Target[];
    iconSrc?: string;
  };
  quizData?: {
    title: string;
    questions: QuizQuestion[];
  };
  gameData?: {
    title: string;
    cardPairs: { id: number; imageUrl: string }[];
  };
  ScrollComponent?: React.ComponentType<{ targetSectionId: string }>;
}

export const InfographicPage: React.FC<InfographicPageProps> = ({
  headerData,
  targetsData,
  quizData,
  gameData,
  ScrollComponent
}) => {
  return (
    <div className="infographic-page relative">
      <div id="header-section">
        <HeaderSection {...headerData} />
      </div>
      <TargetsSection {...targetsData} />
      {quizData && (
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4">{quizData.title}</h2>
          <QuizSection questions={quizData.questions} />
        </div>
      )}
      {gameData && (
        <div className="my-8">
          <ImageMatchingGame title={gameData.title} cardPairs={gameData.cardPairs} />
        </div>
      )}
      <CurrentGlobalSituation />
      {ScrollComponent && <ScrollComponent targetSectionId="header-section" />}
    </div>
  );
};

export default InfographicPage;