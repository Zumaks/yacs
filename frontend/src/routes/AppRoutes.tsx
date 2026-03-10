import React from "react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import App from "@/app/App";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomePage from "@/features/schedule/routes/HomePage";
import FourYearPlannerPage from "@/features/planner/routes/FourYearPlannerPage";
import ProfilePage from "@/features/profile/routes/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

type AppRoutesProps = {
  initialEntries?: string[];
};

export function AppRoutes({ initialEntries }: AppRoutesProps) {
  const Router = initialEntries ? MemoryRouter : BrowserRouter;
  const routerProps = initialEntries ? { initialEntries } : {};

  return (
    <Router {...routerProps}>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="planner" element={<FourYearPlannerPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}
