import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import ProtectedRoute from "./ProtectedRoute"; // Adjust the import path
import rootReducer from "../../utils/store"; // Adjust the import path
import { describe, expect, it } from "vitest";

const renderWithStore = (store: any, ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("ProtectedRoute", () => {
  it("renders children if authenticated", () => {
    const store = createStore(rootReducer, {
      user: { isAuthenticated: true },
    });

    renderWithStore(
      store,
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
  });

  it("redirects to home if not authenticated", () => {
    const store = createStore(rootReducer, {
      user: { isAuthenticated: false },
    });

    renderWithStore(
      store,
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
  });
});
