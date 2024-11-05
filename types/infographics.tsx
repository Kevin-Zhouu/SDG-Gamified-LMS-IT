import { ReactNode } from 'react';

export interface Section {
  id: string;
  type: 'portrait3Horizontal' | 'mediumLengthHeading' | 'quizSection' | 'quiz' | 'text' | 'resourceManagerGame' | 'flashcards';
  title: string;
  content?: any;
  order_id: number;
  data: any;
  onComplete: () => void;
}

export interface Target {
  number: string;
  title: string;
  description: string;
}

export interface TargetsData {
  title: string;
  subtitle: string;
  targets: Target[];
  iconSrc?: string;
}

export interface Event {
  imgSrc: string,
  title: string,
  date: string,
  href?: string
}

export interface EventsData {
  title: string;
  description: string;
  events: Event[];
}

export interface HeaderData {
  newsTitle: string;
  newsContent: string;
  mainTitle: string;
  mainSubtitle: string;
  backgroundColor?: string;
  newsBannerColor?: string;
  illustrationComponent?: ReactNode | string;
  definitionTitle: string;
  definitionPara: string;
}

export interface QuizQuestion {
  type: "single" | "multiple";
  question: string;
  correctAnswers: string[];
  options: string[];
}