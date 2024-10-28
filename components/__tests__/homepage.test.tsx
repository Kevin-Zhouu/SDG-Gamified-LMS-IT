import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Index from '@/app/page';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

describe('Index Page', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  };

  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the SDG goals and main sections', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'user123' } },
    });
    mockSupabase.from.mockResolvedValueOnce({
      data: [
        {
          sdg_id: 1,
          sdg_display_id: '1',
          title: 'No Poverty',
          description: 'End poverty in all forms everywhere.',
        },
      ],
    });

    render(<Index />);

    expect(screen.getByText('Sustainable Development Goals')).toBeInTheDocument();
    expect(screen.getByText('Daily News')).toBeInTheDocument();

    // Wait for the SDG goals to be fetched and rendered
    await waitFor(() => expect(screen.getByText('No Poverty')).toBeInTheDocument());
  });

  test('redirects to login if user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

    render(<Index />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  test('renders daily news articles if available', async () => {
    const mockArticles = [
      {
        title: 'End Child Violence',
        description: '1 in 2 children are victims of violence.',
        url: 'https://www.globalgoals.org/endchildviolence/',
        urlToImage: '/EVAC-header-desktop.jpg',
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ articles: mockArticles }),
    });

    render(<Index />);

    // Check if news section renders correctly
    await waitFor(() => {
      expect(screen.getByText('End Child Violence')).toBeInTheDocument();
      expect(screen.getByText('1 in 2 children are victims of violence.')).toBeInTheDocument();
    });
  });

  test('handles selecting an SDG goal', async () => {
    render(<Index />);

    const sdgGoalButton = screen.getByText('Clean Water And Sanitation');
    fireEvent.click(sdgGoalButton);

    expect(screen.getByText('Clean Water And Sanitation')).toBeInTheDocument();
    expect(screen.getByText('Ensure availability and sustainable management of water and sanitation for all.')).toBeInTheDocument();
  });
});
