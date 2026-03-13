import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AppProviders } from "@/providers/AppProviders";
import { AppRoutes } from "@/routes/AppRoutes";

const mockFetch = () =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(""),
  });

const originalFetch = global.fetch;

beforeAll(() => {
  global.fetch = mockFetch as unknown as typeof fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

test("renders app shell", async () => {
  render(
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );

  expect(await screen.findByRole("link", { name: /^yacs$/i })).toBeInTheDocument();
});

test("shows the not found page for invalid urls", async () => {
  render(
    <AppProviders>
      <AppRoutes initialEntries={["/missing-page"]} />
    </AppProviders>
  );

  expect(await screen.findByRole("heading", { name: /page not found/i })).toBeInTheDocument();
  expect(screen.getByText(/doesn't exist or may have moved/i)).toBeInTheDocument();
});

test("shows the generic error page when a route crashes", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

  function CrashingScreen() {
    throw new Error("boom");
  }

  render(
    <MemoryRouter>
      <ErrorBoundary>
        <CrashingScreen />
      </ErrorBoundary>
    </MemoryRouter>
  );

  expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument();
  expect(screen.getByText(/we could not load this screen/i)).toBeInTheDocument();

  consoleErrorSpy.mockRestore();
});

test("shows a loading spinner while courses load", async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn(() => new Promise(() => undefined)) as unknown as typeof fetch;

  render(
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );

  expect(await screen.findByRole("status", { name: /loading courses/i })).toBeInTheDocument();
  expect(screen.getByText(/pulling the catalog into your schedule workspace/i)).toBeInTheDocument();

  global.fetch = originalFetch;
});

test("shows skeleton course cards while the catalog loads", async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn(() => new Promise(() => undefined)) as unknown as typeof fetch;

  render(
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );

  expect(await screen.findByText(/course cards will appear here as soon as the catalog finishes loading/i)).toBeInTheDocument();
  expect(screen.getAllByTestId("course-card-skeleton")).toHaveLength(3);

  global.fetch = originalFetch;
});
