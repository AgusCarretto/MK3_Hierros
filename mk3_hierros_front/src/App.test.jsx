import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    )
  );
  window.localStorage.clear();
});

describe("App", () => {
  it("renders the site navigation with the MK3 brand mark", async () => {
    render(<App />);
    expect(await screen.findByText("MK3")).toBeInTheDocument();
  });
});
