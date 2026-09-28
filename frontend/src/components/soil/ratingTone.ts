import type { SoilRating } from "../../types";
import type { BadgeTone } from "../common/Badge";

export function ratingTone(rating: SoilRating): BadgeTone {
  switch (rating) {
    case "good":
    case "high":
      return "forest";
    case "adequate":
      return "sky";
    case "low":
      return "amber";
    default:
      return "neutral";
  }
}
