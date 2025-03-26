// src/__tests__/Tooltip.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import Tooltip from "../Tooltip"

// Ensure that the tooltip portal container exists in the document
beforeAll(() => {1
  const tooltipContainer = document.createElement("div");
  tooltipContainer.setAttribute("id", "tooltip");
  document.body.appendChild(tooltipContainer);
});

describe("Tooltip Component", () => {
  beforeEach(() => {
    // Clear the tooltip container before each test to avoid leftovers
    const tooltipContainer = document.getElementById("tooltip");
    if (tooltipContainer) {
      tooltipContainer.innerHTML = "";
    }
  });

  it("shows the tooltip on mouse enter and hides on mouse leave", async () => {
    render(
      <Tooltip text="Tooltip text" width="max-w-32">
        <span>Hover me</span>
      </Tooltip>
    );

    // The tooltip text should not be visible initially.
    expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();

    // Trigger mouse enter on the trigger element
    fireEvent.mouseEnter(screen.getByText("Hover me"));

    // Wait for the tooltip to appear inside the portal
    await waitFor(() => {
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });

    // Now simulate mouse leave and verify the tooltip is removed
    fireEvent.mouseLeave(screen.getByText("Hover me"));
    await waitFor(() => {
      expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
    });
  });

  it("positions the tooltip based on trigger element's bounding rectangle", async () => {
    // Create a mock bounding rectangle for the trigger element
    const mockRect = {
        bottom: 100,
        top: 80,
        left: 50,
        right: 150,
        width: 100,
        height: 20,
        x: 50, // usually same as left
        y: 80, // usually same as top
        toJSON: () => {},
      };

    // Render the Tooltip component and override the getBoundingClientRect method
    render(
      <Tooltip text="Position Test">
        <span>Hover me</span>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me").parentElement as HTMLElement;
    // Override getBoundingClientRect on the trigger element
    trigger.getBoundingClientRect = () => mockRect;

    // Simulate mouse enter to show the tooltip
    fireEvent.mouseEnter(trigger);

    const tooltipEl = await waitFor(() => screen.getByText("Position Test"));
    // The Tooltip component adds 8px offset to the bottom for top position
    expect(tooltipEl).toHaveStyle(`top: ${mockRect.bottom + 8}px`);
    expect(tooltipEl).toHaveStyle(`left: ${mockRect.left}px`);
  });
});
