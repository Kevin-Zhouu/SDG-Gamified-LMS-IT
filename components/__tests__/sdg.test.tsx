// components/__tests__/SdgDetail.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SdgDetail from '@/app/sdg/[slug]/page';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('SdgDetail Component', () => {
  const mockRouter = { push: jest.fn() };
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to login if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

    render(<SdgDetail params={{ slug: '1' }} />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  test('fetches and displays SDG details, modules, and featured module if user is authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'user123' } },
    });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: 'user123' } }),
        };
      }
      if (table === 'sdgs') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              sdg_id: '1',
              sdg_display_id: '6',
              title: 'Clean Water and Sanitation',
            },
          }),
        };
      }
      if (table === 'module') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [
              {
                module_id: 'mod1',
                title: 'Introduction to Water',
                subtitle: 'Understanding water resources',
                sdg_id: '1',
              },
              {
                module_id: 'mod2',
                title: 'Advanced Water Conservation',
                subtitle: 'Methods and practices',
                sdg_id: '1',
              },
            ],
          }),
        };
      }
      if (table === 'usermoduleprogress') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [
              { user_id: 'user123', module_id: 'mod1', progress: 'done' },
              { user_id: 'user123', module_id: 'mod2', progress: 'todo' },
            ],
          }),
        };
      }
      return { select: jest.fn() };
    });

    render(<SdgDetail params={{ slug: '1' }} />);

    // Validate the SDG information and modules
    await waitFor(() => {
      expect(screen.getByText('SDG 6')).toBeInTheDocument();
      expect(screen.getByText('Clean Water and Sanitation')).toBeInTheDocument();
      expect(screen.getByText('Introduction to Water')).toBeInTheDocument();
      expect(screen.getByText('Advanced Water Conservation')).toBeInTheDocument();
    });

    // Featured module "Continue" button should be clickable
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/play/mod2');
  });

  test('navigates to the correct module based on progress status', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'user123' } },
    });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: 'user123' } }),
        };
      }
      if (table === 'sdgs') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              sdg_id: '1',
              sdg_display_id: '6',
              title: 'Clean Water and Sanitation',
            },
          }),
        };
      }
      if (table === 'module') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [
              { module_id: 'mod1', title: 'Intro to SDG 6', sdg_id: '1' },
              { module_id: 'mod2', title: 'Module 2 on SDG 6', sdg_id: '1' },
            ],
          }),
        };
      }
      if (table === 'usermoduleprogress') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [{ user_id: 'user123', module_id: 'mod1', progress: 'done' }],
          }),
        };
      }
      return { select: jest.fn() };
    });

    render(<SdgDetail params={{ slug: '1' }} />);

    await waitFor(() => {
      expect(screen.getByText('Intro to SDG 6')).toBeInTheDocument();
      expect(screen.getByText('Module 2 on SDG 6')).toBeInTheDocument();
    });

    // Ensure clicking the first module navigates correctly
    fireEvent.click(screen.getByText('Module 2 on SDG 6'));

    expect(mockRouter.push).toHaveBeenCalledWith('/play/mod2');
  });
});
