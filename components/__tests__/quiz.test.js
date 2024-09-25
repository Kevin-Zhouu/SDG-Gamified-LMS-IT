import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Quiz from "./Quiz";

describe("Quiz Component", () => {
  const question = "What is React?";
  const options = [
    { id: 1, text: "Library" },
    { id: 2, text: "Framework" },
    { id: 3, text: "Language" },
  ];
  const mockSubmit = jest.fn();

  it("renders the question and options correctly", () => {
    render(
      <Quiz question={question} options={options} onAnswerSubmit={mockSubmit} />
    );
    expect(screen.getByText(question)).toBeInTheDocument();
    options.forEach((option) => {
      expect(screen.getByLabelText(option.text)).toBeInTheDocument();
    });
  });

  it("submits the selected answer", () => {
    render(
      <Quiz question={question} options={options} onAnswerSubmit={mockSubmit} />
    );
    fireEvent.click(screen.getByLabelText("Library"));
    fireEvent.submit(screen.getByRole("button"));
    expect(mockSubmit).toHaveBeenCalledWith("Library");
  });
});
