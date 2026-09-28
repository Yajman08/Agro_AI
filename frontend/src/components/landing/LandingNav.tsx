import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import Button from "../common/Button";

export default function LandingNav() {
  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-700 text-white">
          <Sprout className="h-4.5 w-4.5" />
        </span>
        <span className="font-display text-lg font-semibold text-ink">AgriNexus AI</span>
      </div>
      <nav className="hidden sm:flex items-center gap-2">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            Explore dashboard
          </Button>
        </Link>
        <Link to="/onboarding">
          <Button size="sm">Get started</Button>
        </Link>
      </nav>
      <Link to="/onboarding" className="sm:hidden">
        <Button size="sm">Get started</Button>
      </Link>
    </header>
  );
}
