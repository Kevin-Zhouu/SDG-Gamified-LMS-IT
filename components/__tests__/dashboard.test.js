import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

describe("Dashboard Component", () => {
  it("displays user activity summary", () => {
    const mockData = {
      progress: "75%",
      latestModule: "Introduction to React",
    };
    render(<Dashboard data={mockData} />);
    expect(screen.getByText("Your Progress: 75%")).toBeInTheDocument();
    expect(
      screen.getByText("Latest Module: Introduction to React")
    ).toBeInTheDocument();
  });
});
