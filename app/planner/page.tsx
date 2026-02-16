"use client";

import { useRouter } from "next/navigation";
import AccordionSurvey from "@/components/planner/AccordionSurvey";
import { saveSession } from "@/utils/planner/session";
import { SurveyAnswers } from "@/types/planner";

export default function PlannerPage() {
  const router = useRouter();

  const handleSurveyComplete = async (answers: SurveyAnswers) => {
    try {
      // Save survey answers in session
      saveSession("plannerPreferences", answers);

      // Call API to get recommendations
      const response = await fetch("/api/planner/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: answers }),
      });

      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const data = await response.json();

      if (!data.recommendations) {
        throw new Error("No recommendations returned");
      }

      // Save recommendations in session
      saveSession("plannerRecommendations", data.recommendations);

      // Navigate to recommendations page
      router.push("/planner/recommendations");
    } catch (error) {
      console.error("Planner error:", error);
      alert("Failed to get recommendations. Please try again.");
    }
  };

  return <AccordionSurvey onComplete={handleSurveyComplete} />;
}
