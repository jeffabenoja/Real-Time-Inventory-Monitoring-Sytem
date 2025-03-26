// AddStocksFinishedProduct.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddStocksFinishedProduct from "./AddStockFinishedProduct";

// Mock the Redux store
const store = configureStore({
  reducer: () => ({
    auth: {
      user: { usercode: "testuser", password: "testpass" },
    },
  }),
});

// Setup QueryClient for React Query
const queryClient = new QueryClient();

describe("AddStocksFinishedProduct", () => {
  it("renders the form with product code", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AddStocksFinishedProduct
            product={{ code: "ITEM001", description: "Test Product", category: "Raw Mats", "brand": "sample", unit: "kg"  }}
            toggleModal={() => {}}
          />
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText("ITEM001")).toBeInTheDocument();
  });
});

/*
Short description:
Checks that AddStocksFinishedProduct renders with the given product code.
*/
