import { render, screen, fireEvent } from "@testing-library/react";
import Auth from "./Auth";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Auth Component", () => {
  const mockHandleOnSubmit = vi.fn();
  const mockHandleClickHere = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks(); // Clear previous calls before each test
  });

  it("renders signin form correctly", () => {
    render(
      <Auth
        formType={"signin"}
        handleOnSubmit={mockHandleOnSubmit}
        handleClickHere={mockHandleClickHere}
      />
    );

    expect(screen.getByText("SIGN IN")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText(/New here?/)).toBeInTheDocument();
  });

  it("renders signup form correctly", () => {
    render(
      <Auth
        formType={"signup"}
        handleOnSubmit={mockHandleOnSubmit}
        handleClickHere={mockHandleClickHere}
      />
    );

    expect(screen.getByText("SIGN UP")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText(/Already a user?/)).toBeInTheDocument();
  });

  it("validates form input correctly", async () => {
    render(
      <Auth
        formType={"signin"}
        handleOnSubmit={mockHandleOnSubmit}
        handleClickHere={mockHandleClickHere}
      />
    );

    fireEvent.submit(screen.getByTestId("auth-form"));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "invalidEmail" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByTestId("auth-form"));

    expect(
      await screen.findByText("Invalid email address")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password must be at least 6 characters long")
    ).toBeInTheDocument();
  });

  it("calls handleOnSubmit on valid form submission", async () => {
    render(
      <Auth
        formType={"signin"}
        handleOnSubmit={mockHandleOnSubmit}
        handleClickHere={mockHandleClickHere}
      />
    );

    fireEvent.input(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByTestId("auth-form"));

    expect(mockHandleOnSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("calls handleClickHere on clicking 'Click here'", () => {
    render(
      <Auth
        formType={"signin"}
        handleOnSubmit={mockHandleOnSubmit}
        handleClickHere={mockHandleClickHere}
      />
    );

    fireEvent.click(screen.getByText("Click here"));

    expect(mockHandleClickHere).toHaveBeenCalled();
  });
});
