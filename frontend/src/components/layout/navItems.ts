import {
  LayoutGrid,
  CloudSun,
  Sprout,
  Wheat,
  ScanLine,
  MessagesSquare,
  Leaf,
  UserRound,
  Settings,
} from "lucide-react";
import type { ComponentType } from "react";

export interface NavItem {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const primaryNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Weather", to: "/weather", icon: CloudSun },
  { label: "Soil", to: "/soil", icon: Sprout },
  { label: "Crops", to: "/crops", icon: Wheat },
  { label: "Disease", to: "/disease", icon: ScanLine },
  { label: "Advisory", to: "/advisory", icon: MessagesSquare },
];

export const secondaryNav: NavItem[] = [
  { label: "Regenerative", to: "/regenerative", icon: Leaf },
  { label: "Profile", to: "/profile", icon: UserRound },
  { label: "Settings", to: "/settings", icon: Settings },
];

export const navGroups: NavGroup[] = [
  { label: "Today", items: [primaryNav[0]] },
  { label: "Farm signals", items: primaryNav.slice(1, 5) },
  { label: "AI plan", items: [primaryNav[5]] },
  { label: "Stewardship", items: [secondaryNav[0]] },
  { label: "Farm", items: secondaryNav.slice(1) },
];

// Mobile bottom nav keeps to the most-used five destinations.
export const mobileNav: NavItem[] = [
  { label: "Home", to: "/dashboard", icon: LayoutGrid },
  { label: "Weather", to: "/weather", icon: CloudSun },
  { label: "Disease", to: "/disease", icon: ScanLine },
  { label: "Advisory", to: "/advisory", icon: MessagesSquare },
  { label: "Profile", to: "/profile", icon: UserRound },
];
