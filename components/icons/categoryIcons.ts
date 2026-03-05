import {
  Landmark,
  Pyramid,
  Building2,
  Church,
  Coffee,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";

export const categoryIcons = {
  museum: Landmark,
  pyramids: Pyramid,
  mosque: Building2,
  church: Church,
  cafe: Coffee,
  restaurant: UtensilsCrossed,
  other: MapPin,
};

export function getCategoryIcon(category: string) {
  return categoryIcons[category as keyof typeof categoryIcons] ?? MapPin;
}
