// StockOutAssemble.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import StockOutAssemble from "./StockOutAssemble";

// Mock Redux store
const store = configureStore({
  reducer: () => ({
    auth: {
      user: { usercode: "user001", password: "secret" },
    },
  }),
});

// Mock useAddStock hook
vi.mock("../../hooks/stock/useAddStock", () => ({   
  useAddStock: () => ({
    stockOutAssemble: vi.fn(),
    stockOutAssemblePending: false,
  }),
}));

describe("StockOutAssemble", () => {
  it("renders product code and name", () => {
    render(
      <Provider store={store}>
        <StockOutAssemble
          stockInTransactionNo="TX123"
          productCode="ITEM123"
          productName="Sample Product"
          toggleModal={() => {}}
        />
      </Provider>
    );

    expect(
      screen.getByText(/Remove Stock for ITEM123 - Sample Product/i)
    ).toBeInTheDocument();
  });
});

/*
Short description:
    Checks that StockOutAssemble renders the heading with product code and name.
*/
