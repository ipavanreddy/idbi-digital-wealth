import {
  ArrowLeftRight,
  Briefcase,
  Car,
  Circle,
  Clapperboard,
  HeartPulse,
  Home,
  Plane,
  ReceiptText,
  ShoppingBag,
  Target,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * Resolves an icon name (stored as a string on Category/Goal entities) to a
 * lucide component. Keeping the map explicit lets the bundler tree-shake to
 * just the icons we use.
 */
const ICONS: Record<string, LucideIcon> = {
  Wallet,
  UtensilsCrossed,
  ShoppingBag,
  ReceiptText,
  Home,
  Car,
  Clapperboard,
  TrendingUp,
  HeartPulse,
  ArrowLeftRight,
  Circle,
  Plane,
  Target,
  Briefcase,
};

export function Icon({ name, className, size = 18 }: { name: string; className?: string; size?: number }) {
  const Cmp = ICONS[name] ?? Circle;
  return <Cmp className={className} size={size} aria-hidden />;
}
