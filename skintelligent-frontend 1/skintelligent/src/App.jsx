import { useState } from "react";
import { fonts } from "../styles/tokens";
import * as s from "../styles/shared";
import Nav from "../components/Nav";

// Pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import OnboardingPage from "../pages/OnboardingPage";
import DashboardPage from "../pages/DashboardPage";
import LookupPage from "../pages/LookupPage";
import SavedPage from "../pages/SavedPage";
import ProfilePage from "../pages/ProfilePage";
import ProductDetailPage from "../pages/ProductDetailPage";

// Simple page-based routing — replace with React Router when ready
export default function App() {
  const [page, setPage] = useState("landing");

  // Mock user for authenticated views — remove when real auth is wired
  const mockUser = { name: "Alex", email: "alex@email.com" };
  const isAuth = !["landing", "login", "signup"].includes(page);

  return (
    <div>
      <link href={fonts.googleUrl} rel="stylesheet" />

      {/* Nav */}
      <Nav setPage={setPage} user={isAuth ? mockUser : null} />

      {/* Pages */}
      {page === "landing" && <LandingPage setPage={setPage} />}
      {page === "login" && <LoginPage setPage={setPage} />}
      {page === "signup" && <SignupPage setPage={setPage} />}
      {page === "onboarding" && <OnboardingPage setPage={setPage} />}
      {page === "dashboard" && <DashboardPage />}
      {page === "lookup" && <LookupPage />}
      {page === "saved" && <SavedPage />}
      {page === "profile" && <ProfilePage />}
      {page === "product" && <ProductDetailPage />}
    </div>
  );
}
