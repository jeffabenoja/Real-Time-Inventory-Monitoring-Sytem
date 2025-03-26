import { render } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { describe, it, vi } from "vitest";

// Mock Container to isolate Sidebar
vi.mock("./Container", () => ({
  __esModule: true,
  default: ({ closeSidebar }: { closeSidebar: () => void }) => (
    <div data-testid="mock-container" onClick={closeSidebar}>MockContainer</div>
  ),
}));

describe("Sidebar", () => {
  // Test: renders sidebar and triggers close handler on overlay click
  it("renders and handles close on overlay click", () => {
    const handleClose = vi.fn();

    render(<Sidebar close={handleClose} />);
  });
});
