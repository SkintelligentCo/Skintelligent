import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Nav from "./Nav";

vi.mock("../api/hooks", () => ({
  useLogoutMutation: vi.fn(),
}));

vi.mock("../providers/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

const { useLogoutMutation } = await import("../api/hooks");
const { useAuth } = await import("../providers/AuthProvider");

function TestApp() {
  return (
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Nav />
      <Routes>
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/saved" element={<div>Saved</div>} />
        <Route path="/lookup" element={<div>Lookup</div>} />
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Nav", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("opens the profile menu and logs the user out", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({});

    useAuth.mockReturnValue({
      user: {
        name: "Maya Patel",
        email: "maya@example.com",
      },
    });
    useLogoutMutation.mockReturnValue({
      mutateAsync,
      isPending: false,
    });

    render(<TestApp />);

    await user.click(screen.getByRole("button", { name: /profile options/i }));

    expect(screen.getAllByText(/preferences|settings/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("menuitem", { name: /log out/i }));

    expect(mutateAsync).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Login")).toBeInTheDocument();
  });

  it("opens the mobile menu and navigates through the sheet", async () => {
    const user = userEvent.setup();

    useAuth.mockReturnValue({
      user: {
        name: "Maya Patel",
        email: "maya@example.com",
      },
    });
    useLogoutMutation.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    });

    render(<TestApp />);

    await user.click(screen.getByRole("button", { name: /open navigation menu/i }));

    const dialog = screen.getByRole("dialog", { name: /navigation menu/i });
    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole("link", { name: /saved/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /navigation menu/i })).not.toBeInTheDocument();
    });
  });
});
