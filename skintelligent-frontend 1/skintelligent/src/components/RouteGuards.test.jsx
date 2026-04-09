import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ProtectedRoute, PublicOnlyRoute } from "./RouteGuards";

vi.mock("../providers/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

const { useAuth } = await import("../providers/AuthProvider");

describe("route guards", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("redirects authenticated users away from guest routes", () => {
    useAuth.mockReturnValue({
      user: { profile: { skin_type: "oily" } },
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<div>Guest Route</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("redirects guests to login on protected routes", () => {
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
