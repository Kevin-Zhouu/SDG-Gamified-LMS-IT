// components/__tests__/QuizSectionComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizSectionComponent from '@/components/modulePlayer/sections/quiz/Quiz';
import { QuizSection } from '@/types/sections';

const mockSection: QuizSection = {
  id: '1',
  title: 'Sample Quiz',
  order_id: 1,
  type: 'quiz',
  data: {
    question: 'What is the capital of France?',
    options: ['Paris', 'London', 'Rome', 'Berlin'],
    correctAnswer: 'Paris',
  },
  onComplete: jest.fn(),
};

describe('QuizSectionComponent', () => {
  test('renders the quiz question and options in view mode', () => {
    render(<QuizSectionComponent section={mockSection} />);

    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    mockSection.data.options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('selecting an answer highlights the chosen option', () => {
    render(<QuizSectionComponent section={mockSection} />);
    
    const optionButton = screen.getByText('Paris');
    fireEvent.click(optionButton);

    expect(optionButton).toHaveClass('bg-blue-100');
  });

  test('submitting the correct answer marks it as correct', async () => {
    render(<QuizSectionComponent section={mockSection} />);

    const correctOptionButton = screen.getByText('Paris');
    fireEvent.click(correctOptionButton);
    fireEvent.click(screen.getByText('Submit Answer'));

    await waitFor(() => {
      expect(correctOptionButton).toHaveClass('bg-green-100');
      expect(screen.queryByText('Submit Answer')).toBeNull();
    });
  });

  test('submitting an incorrect answer displays try again button', async () => {
    render(<QuizSectionComponent section={mockSection} />);

    const incorrectOptionButton = screen.getByText('London');
    fireEvent.click(incorrectOptionButton);
    fireEvent.click(screen.getByText('Submit Answer'));

    await waitFor(() => {
      expect(incorrectOptionButton).toHaveClass('bg-red-100');
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  test('renders in edit mode and allows question text modification', () => {
    const onUpdate = jest.fn();
    render(<QuizSectionComponent section={mockSection} isEditable onUpdate={onUpdate} />);

    fireEvent.click(screen.getByText('Edit Question'));
    const questionTextarea = screen.getByPlaceholderText('Enter question');
    fireEvent.change(questionTextarea, { target: { value: 'What is the capital of Germany?' } });
    
    expect(questionTextarea).toHaveValue('What is the capital of Germany?');
  });

  test('allows adding, updating, and removing options in edit mode', () => {
    const onUpdate = jest.fn();
    render(<QuizSectionComponent section={mockSection} isEditable onUpdate={onUpdate} />);

    fireEvent.click(screen.getByText('Edit Question'));

    // Add a new option
    fireEvent.click(screen.getByText('Add Option'));
    const newOptionInput = screen.getAllByPlaceholderText(/Option/i).at(-1);
    fireEvent.change(newOptionInput!, { target: { value: 'Madrid' } });
    expect(newOptionInput).toHaveValue('Madrid');

    // Update an option
    const firstOptionInput = screen.getByPlaceholderText('Option 1');
    fireEvent.change(firstOptionInput, { target: { value: 'Paris Updated' } });
    expect(firstOptionInput).toHaveValue('Paris Updated');

    // Remove an option
    const removeButton = screen.getAllByText('Remove').at(1);
    fireEvent.click(removeButton!);
    expect(screen.queryByDisplayValue('London')).toBeNull();
  });

  test('saves changes and updates the quiz onSave', () => {
    const onUpdate = jest.fn();
    render(<QuizSectionComponent section={mockSection} isEditable onUpdate={onUpdate} />);

    fireEvent.click(screen.getByText('Edit Question'));

    const questionTextarea = screen.getByPlaceholderText('Enter question');
    fireEvent.change(questionTextarea, { target: { value: 'Updated Question?' } });
    fireEvent.click(screen.getByText('Save Changes'));

    expect(onUpdate).toHaveBeenCalledWith({
      ...mockSection,
      data: {
        ...mockSection.data,
        question: 'Updated Question?',
      },
    });
  });
});
