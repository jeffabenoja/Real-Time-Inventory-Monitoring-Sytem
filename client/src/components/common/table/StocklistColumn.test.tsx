// src/__tests__/StockListColumns.test.tsx
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import StockListColumns from "./StockListColumns";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// --- Minimal Redux mock setup ---
const mockInventory = [
  {
    item: { id: 1 },
    inQuantity: 20,
    outQuantity: 5,
  },
];

vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useSelector: vi.fn(() => mockInventory),
  };
});

// Dummy fields for dynamic columns
const fields = [
  { key: "name", label: "Name", classes: "text-bold" },
  { key: "category", label: "Category" },
];

// Sample row data that includes all expected fields
const mockRow = {
  id: 1,
  name: "Item 1",
  category: "Food",
  price: 10,
  cost: 5,
};

// Create a minimal Redux store (if needed)
const store = configureStore({
  reducer: (state = {}) => state,
});

// Prepare action callbacks
let onView: (item: any) => void, onAdd: (item: any) => void, onUpdate: (item: any) => void, onApproval: (item: any) => void;
beforeEach(() => {
  onView = vi.fn();
  onAdd = vi.fn();
  onUpdate = vi.fn();
  onApproval = vi.fn();
});

// --- Helper component to render the table ---
const TestTable = ({ data, columns }: { data: any[]; columns: any[] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

describe("StockListColumns", () => {
  it("renders dynamic and static columns and triggers actions", async () => {
    const columns = StockListColumns({
      fields,
      onView,
      onAdd,
      onUpdate,
      onApproval,
    });

    // Render table wrapped in Redux Provider (if your columns rely on redux selectors)
    const { getByText, getAllByRole } = render(
      <Provider store={store}>
        <TestTable data={[mockRow]} columns={columns} />
      </Provider>
    );

    // Validate headers (dynamic and static)
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Category")).toBeInTheDocument();
    expect(getByText("Current Stock")).toBeInTheDocument();
    expect(getByText("Price")).toBeInTheDocument();
    expect(getByText("Cost")).toBeInTheDocument();
    expect(getByText("Actions")).toBeInTheDocument();

    // Validate calculated cell values:
    // Current Stock: 20 - 5 = 15.00
    expect(getByText("15.00")).toBeInTheDocument();
    // Price: 10 formatted as 10.00
    expect(getByText("10.00")).toBeInTheDocument();
    // Cost: 5 formatted as 5.00
    expect(getByText("5.00")).toBeInTheDocument();

    // Get all action buttons within the Actions cell.
    // There should be four buttons for View, Stock, Update, and Approval.
    const actionButtons = getAllByRole("button");
    // Trigger each button and verify the appropriate callback is called.
    fireEvent.click(actionButtons[0]); // View
    fireEvent.click(actionButtons[1]); // Stock/Add
    fireEvent.click(actionButtons[2]); // Update
    fireEvent.click(actionButtons[3]); // Approval

    await waitFor(() => {
      expect(onView).toHaveBeenCalledWith(mockRow);
      expect(onAdd).toHaveBeenCalledWith(mockRow);
      expect(onUpdate).toHaveBeenCalledWith(mockRow);
      expect(onApproval).toHaveBeenCalledWith(mockRow);
    });
  });
});
