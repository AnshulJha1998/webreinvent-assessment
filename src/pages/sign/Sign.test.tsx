import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Sign from "./Sign"; // Adjust the import path
import { httpService } from "../../utils/services";
import { login } from "../../utils/slices/userSlice";
import { fetchAllUsers } from "../../utils/slices/allUsersSlice";
import configureStore from "redux-mock-store";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../utils/services"); // Mock the httpService module
vi.mock("../../utils/slices/allUsersSlice", () => ({
  fetchAllUsers: vi.fn(() => ({ type: "FETCH_ALL_USERS" })),
}));
vi.mock("../../utils/slices/userSlice", () => ({
  login: vi.fn(),
}));

const mockStore = configureStore([]);

const renderWithStore = (store: any, ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("Sign Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      user: { isAuthenticated: false },
    });
  });

  it("renders Auth component", () => {
    renderWithStore(store, <Sign />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it("dispatches fetchAllUsers on mount", () => {
    renderWithStore(store, <Sign />);

    expect(fetchAllUsers).toHaveBeenCalled();
  });

  it("handles sign in", async () => {
    (httpService as vi.Mock).mockResolvedValueOnce({ token: "fake_token" });

    renderWithStore(store, <Sign />);

    fireEvent.click(screen.getByText(/submit/i));
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        token: "fake_token",
        userData: expect.any(Object),
      });
    });
  });

  it("handles sign up", async () => {
    (httpService as vi.Mock).mockResolvedValueOnce({
      token: "fake_token",
      id: "1",
    });

    renderWithStore(store, <Sign />);

    fireEvent.click(screen.getByText(/sign up/i));
    fireEvent.click(screen.getByText(/submit/i));
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        token: "fake_token",
        userData: expect.any(Object),
      });
    });
  });

  it("shows an error alert if login fails", async () => {
    (httpService as vi.Mock).mockResolvedValueOnce({ error: "Unauthorized" });

    renderWithStore(store, <Sign />);

    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("User is not authorized");
    });
  });

  it("shows an error alert if sign up fails", async () => {
    (httpService as vi.Mock).mockResolvedValueOnce({ error: "Unauthorized" });

    renderWithStore(store, <Sign />);

    fireEvent.click(screen.getByText(/sign up/i));
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("User is not authorized");
    });
  });
});
