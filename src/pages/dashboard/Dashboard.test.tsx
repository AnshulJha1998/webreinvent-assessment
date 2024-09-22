import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard"; // Adjust the import path
import { logout } from "../../utils/slices/userSlice";
import configureStore from "redux-mock-store";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../utils/slices/userSlice", () => ({
  logout: vi.fn(),
}));

const mockStore = configureStore([]);

const renderWithStore = (store: any, ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("Dashboard Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      getAllUsers: {
        allUsers: [
          {
            email: "user@example.com",
            first_name: "John",
            last_name: "Doe",
            avatar: "avatar.png",
          },
        ],
        loading: false,
        error: null,
      },
      user: {
        userData: { email: "user@example.com" },
      },
    });
  });

  it("renders the Dashboard with user information", () => {
    renderWithStore(store, <Dashboard />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    store = mockStore({
      getAllUsers: {
        allUsers: [],
        loading: true,
        error: null,
      },
      user: {
        userData: { email: "user@example.com" },
      },
    });

    renderWithStore(store, <Dashboard />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("shows error message", () => {
    store = mockStore({
      getAllUsers: {
        allUsers: [],
        loading: false,
        error: "Failed to fetch users.",
      },
      user: {
        userData: { email: "user@example.com" },
      },
    });

    renderWithStore(store, <Dashboard />);

    expect(screen.getByTestId("error")).toHaveTextContent(
      "Failed to fetch users."
    );
  });

  it("logs out the user", () => {
    renderWithStore(store, <Dashboard />);

    fireEvent.click(screen.getByText(/log out/i));

    expect(logout).toHaveBeenCalled();
  });

  it("displays a message if user is not found", () => {
    store = mockStore({
      getAllUsers: {
        allUsers: [],
        loading: false,
        error: null,
      },
      user: {
        userData: null,
      },
    });

    renderWithStore(store, <Dashboard />);

    expect(screen.getByText(/cannot find user/i)).toBeInTheDocument();
  });
});
