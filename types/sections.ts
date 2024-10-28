import { ReactNode } from "react";

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

export interface BaseSection {
  id: string;
  title: string;
  order_id: number;
  type:
    | "quiz"
    | "text"
    | "resourceManagerGame"
    | "flashcards"
    | "header"
    | "events";
  data: any;
}

export interface QuizSection extends BaseSection {
  type: "quiz";
  data: {
    question: string;
    options: string[];
    correctAnswer: string;
  };

  // onComplete: () => void;
}

export interface TextSection extends BaseSection {
  type: "text";
  data: {
    content: string;
  };

  // onComplete: () => void;
}

export interface HeaderSection extends BaseSection {
  type: "header";
  data: HeaderData;
}

export interface ResourceManagerGameSection extends BaseSection {
  type: "resourceManagerGame";
  data: {};

  // onComplete?: () => void;
}

export interface FlashcardGameSection extends BaseSection {
  type: "flashcards";
  data: {
    title: string;
    cardPairs: { id: number; concept: string; details: string }[];
  };
}

export interface EventsSection extends BaseSection {
  type: "events";
  data: {
    title: string;
    description: string;
    events: Event[];
  };
}

export interface Event {
  imgSrc: string;
  title: string;
  date: string;
  href?: string;
}

export type Section =
  | QuizSection
  | TextSection
  | ResourceManagerGameSection
  | FlashcardGameSection
  | HeaderSection
  | EventsSection;

// Add these new interfaces
export interface Module {
  id: string;
  title: string;
  subtitle: string;
  order_id: number;
  sections: Section[];
}

export interface SDG {
  title: string;
  description: string;
  sdg_display_id: number;
  modules: Module[];
}
