import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import LoginPage from "./LoginPage";
import { NotificationProvider } from "../providers/NotificationProvider";

vi.mock("../api/hooks", () => ({
  useLoginMutation: vi.fn(),
}));

const { useLoginMutation } = await import("../api/hooks");

describe("LoginPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits credentials and redirects to the dashboard when a profile exists", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({
      user: {
        profile: { skin_type: "oily" },
      },
    });

    useLoginMutation.mockReturnValue({
      mutateAsync,
      isPending: false,
      error: null,
    });

    render(
      <NotificationProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </NotificationProvider>,
    );

    await user.type(screen.getByPlaceholderText("Email address"), "maya@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(mutateAsync).toHaveBeenCalledWith({
      email: "maya@example.com",
      password: "Password123!",
    });
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });
});
