import { render, screen, fireEvent, act } from "@testing-library/react";
import ModulePlayer from "@/components/modulePlayer/ModulePlayer";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import '@testing-library/jest-dom';
import { Section } from "@/types/sections";

jest.mock("@/utils/supabase/client");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockRouter = { push: jest.fn() };
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    upsert: jest.fn(),
    select: jest.fn(),
  })),
};

describe("ModulePlayer Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  const modules = {
    module_id: "module1",
    title: "Sample Module",
    subtitle: "This is a sample module",
    sdg_id: "1",
    order_id: 1,
  };
  
  const sections: Section[] = [
    // add example sections here
    {
      id: "section1",
      title: "Introduction",
      order_id: 1,
      type: "text",
      data: {
        content: "This is the introduction section.",
      },
    },
    // quiz section
    {
      id: "section2",
      title: "Quiz",
      order_id: 2,
      type: "quiz",
      data: {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris",
      },
    },
    // flashcard section
    {
      id: "section3",
      title: "Flashcards",
      order_id: 3,
      type: "flashcards",
      data: {
        title: "Sample Flashcards",
        cardPairs: [
          { id: 1, concept: "Concept 1", details: "Details 1" },
          { id: 2, concept: "Concept 2", details: "Details 2" },
        ],
      },
    },
  ];

  const sectionsRef = { current: {} };
  const onComplete = jest.fn();

  it("renders the ModulePlayer component correctly", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user1" } } });

    render(
        <ModulePlayer
            modules={modules}
            sections={sections}
            sectionsRef={sectionsRef}
            onComplete={onComplete}
            moduleTitle="Sample Module Title"
            nextModuleId="module2"
        />
    );

    expect(screen.getByText("Sample Module Title")).toBeInTheDocument();
  });
});
