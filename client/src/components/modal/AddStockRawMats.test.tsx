// AddStocksRawMats.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddStocksRawMats from "./AddStockRawMats";

// Mock store
const store = configureStore({
  reducer: () => ({
    auth: {
      user: { usercode: "tester", password: "secret" },
    },
  }),
});

// React Query client
const queryClient = new QueryClient();

describe("AddStocksRawMats", () => {
  it("renders with product code and name", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AddStocksRawMats
            productCode="ITEM001"
            productName="Sugar"
            toggleModal={() => {}}
          />
        </QueryClientProvider>
      </Provider>
    );

    expect(screen.getByText(/ITEM001 - Sugar/i)).toBeInTheDocument();
  });
});
