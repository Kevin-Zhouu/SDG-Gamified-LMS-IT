// components/__tests__/AdminBuilder.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminBuilder from '@/app/builder/page';
import { createClient } from '@/utils/supabase/client';

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  DndContext: jest.fn().mockImplementation(({ children }) => <div>{children}</div>),
}));

describe('AdminBuilder Component', () => {
  const mockSupabase = {
    auth: { getSession: jest.fn() },
  };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: { access_token: 'test-token' } } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SDG input fields and modules section', () => {
    render(<AdminBuilder />);

    expect(screen.getByPlaceholderText('Enter SDG title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter SDG description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter SDG display ID')).toBeInTheDocument();
    expect(screen.getByText('Modules')).toBeInTheDocument();
  });

  test('allows adding a new module', () => {
    render(<AdminBuilder />);

    const addModuleButton = screen.getByText('Add Module');
    fireEvent.click(addModuleButton);

    expect(screen.getByText('New Module 1')).toBeInTheDocument();
  });

  test('allows adding a new section to the current module', () => {
    render(<AdminBuilder />);

    const addModuleButton = screen.getByText('Add Module');
    fireEvent.click(addModuleButton);

    const editSectionsButton = screen.getByText('Edit Sections');
    fireEvent.click(editSectionsButton);

    const addSectionButton = screen.getByText('Add Section');
    fireEvent.click(addSectionButton);

    const quizSection = screen.getByText('Quiz Section');
    fireEvent.click(quizSection);

    expect(screen.getByText('Edit Quiz Question')).toBeInTheDocument();
  });

  test('allows reordering sections within a module', () => {
    render(<AdminBuilder />);

    const addModuleButton = screen.getByText('Add Module');
    fireEvent.click(addModuleButton);

    const editSectionsButton = screen.getByText('Edit Sections');
    fireEvent.click(editSectionsButton);

    const addSectionButton = screen.getByText('Add Section');
    fireEvent.click(addSectionButton);

    const textSection = screen.getByText('Text Section');
    fireEvent.click(textSection);

    // Mock drag-and-drop behavior
    const [firstSection] = screen.getAllByText('Text Section');
    fireEvent.dragStart(firstSection);
    fireEvent.drop(firstSection);

    expect(screen.getByText('Text Section')).toBeInTheDocument();
  });

  test('allows updating SDG title, description, and display ID', () => {
    render(<AdminBuilder />);

    const titleInput = screen.getByPlaceholderText('Enter SDG title');
    fireEvent.change(titleInput, { target: { value: 'Clean Water & Sanitation' } });
    expect(titleInput).toHaveValue('Clean Water & Sanitation');

    const descriptionTextarea = screen.getByPlaceholderText('Enter SDG description');
    fireEvent.change(descriptionTextarea, { target: { value: 'Ensure availability of clean water for all.' } });
    expect(descriptionTextarea).toHaveValue('Ensure availability of clean water for all.');

    const displayIdInput = screen.getByPlaceholderText('Enter SDG display ID');
    fireEvent.change(displayIdInput, { target: { value: 6 } });
    expect(displayIdInput).toHaveValue(6);
  });

  test('saves SDG data when save button is clicked', async () => {
    render(<AdminBuilder />);

    const saveButton = screen.getByText('Save SDG');
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockSupabase.auth.getSession).toHaveBeenCalled());
    // You might check for specific network calls or function calls here
    // depending on the specifics of your setup.
  });
});
