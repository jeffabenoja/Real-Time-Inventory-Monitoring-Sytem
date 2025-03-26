// src/__tests__/ProductColumns.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductColumns from "./ProductColumns";

// Minimal Redux store and mock useSelector for inventory data
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
  { key: "name", label: "Name", classes: "font-bold" },
  { key: "category", label: "Category" },
];

// Sample row data
const mockRow = {
  id: 1,
  name: "Test Product",
  category: "Test Category",
  price: 10,
  averageCost: 5,
};

// Dummy callbacks
let onView: (item: any) => void, onAdd: (item: any) => void, onUpdate: (item: any) => void, onApproval: (item: any) => void;
beforeEach(() => {
  onView = vi.fn();
  onAdd = vi.fn();
  onUpdate = vi.fn();
  onApproval = vi.fn();
});

// Minimal Redux store
const store = configureStore({
  reducer: (state = {}) => state,
});

// Helper component to render the table
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

describe("ProductColumns", () => {
  it("renders columns correctly and triggers action callbacks", async () => {
    const columns = ProductColumns({
      fields,
      onView,
      onAdd,
      onUpdate,
      onApproval,
    });

    const { getByText, getAllByRole } = render(
      <Provider store={store}>
        <TestTable data={[mockRow]} columns={columns} />
      </Provider>
    );

    // Check dynamic headers
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Category")).toBeInTheDocument();

    // Check static headers
    expect(getByText("Current Stock")).toBeInTheDocument();
    expect(getByText("Price")).toBeInTheDocument();
    expect(getByText("Average Cost")).toBeInTheDocument();
    expect(getByText("Actions")).toBeInTheDocument();

    // Validate calculated current stock (20 - 5 = 15)
    expect(getByText("15")).toBeInTheDocument();
    // Validate formatted price and average cost
    expect(getByText("10.00")).toBeInTheDocument();
    expect(getByText("5.00")).toBeInTheDocument();

    // Get all action buttons (View, Stock, Update, Approval)
    const actionButtons = getAllByRole("button");
    // Simulate clicking each action button
    fireEvent.click(actionButtons[0]); // View
    fireEvent.click(actionButtons[1]); // Stock
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