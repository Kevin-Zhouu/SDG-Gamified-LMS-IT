import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/app/login/page';
import {SubmitButton} from '@/app/login/submit-button';

describe('LoginPage Component', () => {
  const mockSignIn = jest.fn();
  const mockSignUp = jest.fn();
  const mockSignInWithGoogle = jest.fn();
  const mockSignInWithGithub = jest.fn();

  const setup = () => {
    render(
      <LoginPage
        searchParams={{ message: 'Could not authenticate user' }}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login page with form elements', () => {
    setup();

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText(/Or sign in with/i)).toBeInTheDocument();
  });

  test('displays error message when login fails', () => {
    setup();

    expect(screen.getByText('Could not authenticate user')).toBeInTheDocument();
  });

  test('calls signIn function with email and password', () => {
    setup();

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByText('Sign In');

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        password: 'password123',
      })
    );
  });

  test('calls signUp function when user clicks sign-up button', () => {
    setup();

    const signUpButton = screen.getByText('Sign up now!');
    fireEvent.click(signUpButton);

    expect(mockSignUp).toHaveBeenCalledTimes(1);
  });

  test('calls signInWithGoogle when Google sign-in button is clicked', () => {
    setup();

    const googleButton = screen.getByText('Google');
    fireEvent.click(googleButton);

    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });

  test('calls signInWithGithub when GitHub sign-in button is clicked', () => {
    setup();

    const githubButton = screen.getByText('GitHub');
    fireEvent.click(githubButton);

    expect(mockSignInWithGithub).toHaveBeenCalledTimes(1);
  });

  test('displays pending text on button while signing in', () => {
    const { rerender } = render(
      <SubmitButton pendingText="Signing In...">Sign In</SubmitButton>
    );

    rerender(
      <SubmitButton pendingText="Signing In..." formAction="mockSignIn">
        Sign In
      </SubmitButton>
    );

    expect(screen.getByText(/Signing In.../i)).toBeInTheDocument();
  });
});
