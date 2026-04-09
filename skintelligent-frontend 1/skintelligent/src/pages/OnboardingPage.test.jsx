import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import OnboardingPage from "./OnboardingPage";
import { NotificationProvider } from "../providers/NotificationProvider";

vi.mock("../api/hooks", () => ({
  useGenerateRecommendationsMutation: vi.fn(),
  useUpsertProfileMutation: vi.fn(),
}));

const {
  useGenerateRecommendationsMutation,
  useUpsertProfileMutation,
} = await import("../api/hooks");

describe("OnboardingPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("builds the expected profile payload and generates recommendations", async () => {
    const user = userEvent.setup();
    const upsertProfile = vi.fn().mockResolvedValue({});
    const generateRecommendations = vi.fn().mockResolvedValue({});

    useUpsertProfileMutation.mockReturnValue({
      mutateAsync: upsertProfile,
      isPending: false,
      error: null,
    });
    useGenerateRecommendationsMutation.mockReturnValue({
      mutateAsync: generateRecommendations,
      isPending: false,
      error: null,
    });

    render(
      <NotificationProvider>
        <MemoryRouter initialEntries={["/onboarding"]}>
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </NotificationProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Acne" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Niacinamide" }));
    await user.click(screen.getByRole("button", { name: "Acne-prone" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getAllByRole("button", { name: "Low" })[1]);
    await user.click(screen.getByRole("button", { name: "Serum" }));
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(upsertProfile).toHaveBeenCalledWith({
      acne_prone: true,
      budget_range: "low",
      fragrance_allergy: false,
      ingredient_avoid: [],
      ingredient_preferences: ["niacinamide"],
      preferred_product_types: ["serum"],
      routine_level: "basic",
      skin_concerns: ["acne"],
      skin_sensitivity: "medium",
      skin_type: "combination",
    });
    expect(generateRecommendations).toHaveBeenCalledWith({ limit: 6 });
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });
});
