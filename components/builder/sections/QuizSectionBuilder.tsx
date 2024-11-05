'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { QuizQuestion } from '@/types/infographics';

interface QuizSectionBuilderProps {
    content?: { title: string; questions: QuizQuestion[] };
    onUpdate: (content: { title: string; questions: QuizQuestion[] }) => void;
  }
  
  const QuizSectionBuilder: React.FC<QuizSectionBuilderProps> = ({ content, onUpdate }) => {
    const [title, setTitle] = useState(content?.title || '');
    const [questions, setQuestions] = useState<QuizQuestion[]>(content?.questions || []);
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
      type: 'single',
      question: '',
      correctAnswers: [],
      options: ['', '', '', ''],
    });
  
    useEffect(() => {
      if (content) {
        setTitle(content.title);
        setQuestions(content.questions);
      }
    }, [content]);
  
    const handleQuestionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setCurrentQuestion(prev => ({ ...prev, [name]: value }));
    };
  
    const handleOptionChange = (index: number, value: string) => {
      setCurrentQuestion(prev => ({
        ...prev,
        options: prev.options.map((option: string, i: number) => i === index ? value : option),
      }));
    };
  
    const handleCorrectAnswerChange = (option: string, isChecked: boolean) => {
      setCurrentQuestion(prev => ({
        ...prev,
        correctAnswers: isChecked
          ? [...prev.correctAnswers, option]
          : prev.correctAnswers.filter(answer => answer !== option),
      }));
    };
  
    const addQuestion = () => {
      if (currentQuestion.question && currentQuestion.options.every(option => option !== '')) {
        setQuestions(prev => [...prev, currentQuestion]);
        setCurrentQuestion({
          type: 'single',
          question: '',
          correctAnswers: [],
          options: ['', '', '', ''],
        });
      }
    };
  
    const saveQuiz = () => {
      if (title && questions.length > 0) {
        onUpdate({ title, questions });
      }
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Quiz Section</h2>
      
      <Input
        name="title"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        placeholder="Quiz Title"
        className="mb-4"
      />

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Add Question</h3>
        <Select
          name="type"
          value={currentQuestion.type}
          onChange={handleQuestionChange}
          className="mb-2"
        >
          <option value="single">Single Answer</option>
          <option value="multiple">Multiple Answers</option>
        </Select>
        <Textarea
          name="question"
          value={currentQuestion.question}
          onChange={handleQuestionChange}
          placeholder="Enter question"
          className="mb-2"
        />
        {currentQuestion.options.map((option: string, index: number) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              value={option}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="mr-2"
            />
            <Checkbox
              checked={currentQuestion.correctAnswers.includes(option)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleCorrectAnswerChange(option, e.target.checked)}
            />
            <span className="ml-2">Correct</span>
          </div>
        ))}
        <Button onClick={addQuestion} className="mt-2">Add Question</Button>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Current Questions</h3>
        {questions.map((q, index) => (
          <div key={index} className="mb-2">
            <p><strong>Q{index + 1}:</strong> {q.question}</p>
            <p><strong>Type:</strong> {q.type}</p>
            <p><strong>Options:</strong> {q.options.join(', ')}</p>
            <p><strong>Correct Answers:</strong> {q.correctAnswers.join(', ')}</p>
          </div>
        ))}
      </div>

      <Button onClick={saveQuiz}>Save Quiz Section</Button>
    </div>
  );
};

export default QuizSectionBuilder;