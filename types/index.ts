// User types
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Place types
export interface Place {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  vibe: string[]; // e.g., ["historical", "romantic", "photography"]
  workingHours: {
    [key: string]: { open: string; close: string } | null; // day of week
  };
  entryFees: number | null;
  cameraFees: number | null;
  bestTimeToVisit: {
    season?: string[];
    timeOfDay?: string[];
  };
  petsFriendly: boolean;
  kidsFriendly: boolean;
  averageRating: number;
  totalReviews: number;
  status: "approved" | "pending" | "rejected";
  createdBy: string; // userId
  createdAt: Date;
  updatedAt: Date;
}

// Memory/Post types
export interface Memory {
  id: string;
  userId: string;
  placeId: string;
  images: string[];
  rating: number;
  pros: string[];
  cons: string[];
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Route planning types
export interface RoutePlan {
  id: string;
  userId: string;
  places: string[]; // placeIds
  date: Date;
  estimatedDuration: number; // in minutes
  route: {
    placeId: string;
    order: number;
    estimatedArrival: Date;
    estimatedDeparture: Date;
  }[];
  createdAt: Date;
}

// Survey types
export interface Survey {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  questions: SurveyQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyQuestion {
  id: string;
  surveyId: string;
  question: string;
  type: "single_choice" | "multiple_choice" | "range" | "text";
  options?: string[] | { value: string; label: string; icon?: string }[];
  order: number;
  isRequired: boolean;
  createdAt: Date;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId?: string;
  answers: SurveyAnswer[];
  completedAt: Date;
}

export interface SurveyAnswer {
  id: string;
  responseId: string;
  questionId: string;
  answer: any; // Flexible to store any answer type
  createdAt: Date;
}

// Planner preferences (derived from survey)
export interface PlannerPreferences {
  vibes: string[];
  budget: string;
  timeAvailable: number; // hours
  hasPets: boolean;
  hasKids: boolean;
  timeOfDay: string[];
  numberOfPlaces: number;
}

