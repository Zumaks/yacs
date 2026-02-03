import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "@/app/App";
import HomePage from "@/features/schedule/routes/HomePage";
import FourYearPlannerPage from "@/features/planner/routes/FourYearPlannerPage";
import ProfilePage from "@/features/profile/routes/ProfilePage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="planner" element={<FourYearPlannerPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
