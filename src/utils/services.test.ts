import { afterEach, describe, expect, it, vi } from "vitest";
import { httpService } from "./services";

globalThis.fetch = vi.fn();

describe("httpService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should make a GET request and return the data", async () => {
    const mockResponse = { data: "test data" };
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await httpService<{ data: string }>(
      "https://api.example.com/data"
    );

    expect(fetch).toHaveBeenCalledWith("https://api.example.com/data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should make a POST request with data and return the data", async () => {
    const mockResponse = { data: "test data" };
    const postData = { key: "value" };

    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await httpService<{ data: string }>(
      "https://api.example.com/data",
      "POST",
      postData
    );

    expect(fetch).toHaveBeenCalledWith("https://api.example.com/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error for non-OK responses", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(httpService("https://api.example.com/data")).rejects.toThrow(
      "HTTP error! Status: 404"
    );
  });

  it("should throw an error for failed requests", async () => {
    (fetch as vi.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(httpService("https://api.example.com/data")).rejects.toThrow(
      "Request failed: Network error"
    );
  });
});
