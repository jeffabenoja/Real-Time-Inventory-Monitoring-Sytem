// CSVUploader.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CSVUploader from "./CsvUploader";

// Mock hook
vi.mock("../../hooks/items/useItemMaterials", () => ({
  useItemMaterials: () => ({
    multipleItems: vi.fn(),
    isPendingMultiple: false,
  }),
}));

describe("CSVUploader", () => {
  it("renders file input and buttons", () => {
    render(
      <CSVUploader
        isOnSubmit={() => {}}
        isLoading={false}
        toggleModal={() => {}}
      />
    );

    expect(screen.getByText(/Upload CSV files/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });
});

/*
Short description:
Checks that CSVUploader renders the file input and action buttons.
*/
