import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavBar from "./NavBar";

describe("NavBar Component", () => {
  it("renders correctly", () => {
    render(<NavBar />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/modules/i)).toBeInTheDocument();
    expect(screen.getByText(/quizzes/i)).toBeInTheDocument();
  });

  it("handles logout when logout button is clicked", () => {
    const mockLogout = jest.fn();
    render(<NavBar logout={mockLogout} />);
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    userEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});
