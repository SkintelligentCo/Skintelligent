# Skintelligent — Frontend Pages

Pure UI pages with the Skintelligent design system. No business logic, no state management, no API calls. Your team adds all of that.

## Structure

```
src/
├── App.jsx                        # Page router (replace with React Router)
│
├── components/                    # Reusable UI pieces
│   ├── ChipSelect.jsx             # Multi/single select chip group
│   ├── FitScoreRing.jsx           # Circular score ring
│   ├── Nav.jsx                    # Top navigation bar
│   ├── ScoreBar.jsx               # Horizontal score bar
│   └── Tag.jsx                    # Small label chip
│
├── pages/                         # One file per screen
│   ├── LandingPage.jsx            # Marketing homepage
│   ├── LoginPage.jsx              # Sign in form
│   ├── SignupPage.jsx             # Create account form
│   ├── OnboardingPage.jsx         # 4-step profile builder (shows step 1)
│   ├── DashboardPage.jsx          # Recommendation feed with product cards
│   ├── LookupPage.jsx             # Product search
│   ├── SavedPage.jsx              # Saved products (empty state)
│   ├── ProfilePage.jsx            # Edit skin profile
│   └── ProductDetailPage.jsx      # Full product analysis view
│
└── styles/                        # Design system
    ├── tokens.js                  # Colors, fonts, radii, shadows
    └── shared.js                  # Reusable style objects (buttons, cards, inputs, etc.)
```

## What's included

- 9 pages with full visual design
- 5 reusable components
- Complete design token system (colors, fonts, spacing, shadows)
- Shared style library (buttons, cards, inputs, chips, filters)
- Hardcoded example data in pages for visual reference
- Simple `setPage()` routing — swap for React Router

## What your team needs to add

- Real routing (React Router / Next.js)
- State management (Context, Zustand, Redux, etc.)
- API integration (auth, products, profiles, saved items)
- Form state & validation on login/signup/onboarding
- Step progression on the onboarding flow
- Search functionality on the lookup page
- Save/unsave toggle on product cards
- Product detail modal or page navigation
- Fit score calculation (see ProductDetailPage for the UI layout)

## Design System

Everything imports from `styles/tokens.js` and `styles/shared.js`:

```js
import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

// Use in JSX:
<div style={s.card}>...</div>
<button style={s.btnPrimary}>Click</button>
<input style={s.input} />
```

**Fonts:** DM Serif Display (headings) + DM Sans (body)
**Palette:** Cream, terracotta, deep rose, moss green, warm neutrals
