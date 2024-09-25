import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../components/Login";

describe("Login/Signup Component", () => {
  it("renders login and signup forms", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  it("submits the form with user data", () => {
    const mockSubmit = jest.fn();
    render(<Login onSubmit={mockSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Login"));
    expect(mockSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });
});
