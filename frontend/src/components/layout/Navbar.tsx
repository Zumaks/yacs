import React from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import ClassSearch from "@/features/schedule/components/ClassSearch";
import SemesterSelect from "@/features/schedule/components/SemesterSelect";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/login", label: "Login" },
  { to: "/planner", label: "4-Year Plan" },
  { to: "/", label: "Schedule" },
  { to: "/professors", label: "Professors" },
  { to: "/profile", label: "Profile" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const location = useLocation();

  React.useEffect(() => setMenuOpen(false), [location]);

  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header ref={headerRef} className="border-b border-border bg-header p-4 text-input-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="text-l font-bold">YACS</a>
          <button
            ref={toggleRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 xl:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="h-6 w-6" aria-hidden="true" />}
          </button>
          <div className="order-2 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center xl:order-none xl:w-auto xl:flex-1">
            <div className="min-w-0 flex-1"><ClassSearch /></div>
            <SemesterSelect />
          </div>
          <nav
            id="primary-navigation"
            aria-label="Primary navigation"
            className={`${menuOpen ? "flex" : "hidden"} order-3 w-full flex-col gap-1 border-t border-border pt-3 xl:order-none xl:flex xl:w-auto xl:flex-row xl:items-center xl:gap-2 xl:border-0 xl:pt-0`}
          >
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `flex min-h-[44px] items-center rounded px-3 py-2 hover:bg-muted hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${isActive ? "text-blue-400" : "text-foreground"}`}
              >
                {label}
              </NavLink>
            ))}
            <ThemeToggle className="h-11 w-11 self-start xl:self-auto" />
          </nav>
        </div>
      </header>
      <div id="class-search-results-slot" className="w-full"></div>
    </>
  );
}
export default Navbar;
