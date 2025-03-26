import { render, screen, fireEvent } from "@testing-library/react";
import NavItem from "./NavItem";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { FaHome } from "react-icons/fa"; // mock icon

describe("NavItem", () => {
  it("renders label and handles click", () => {
    const handleClick = vi.fn();

    render(
      <MemoryRouter>
        <NavItem
          label="Home"
          path="/home"
          icon={FaHome}
          clicked={handleClick}
        />
      </MemoryRouter>
    );

    const link = screen.getByText("Home");
    expect(link).toBeInTheDocument();

    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalled();
  });
});
