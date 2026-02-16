"use client";

import { useState } from "react";
import { Question, QuestionOption, SurveyAnswers } from "@/types/planner";

interface AccordionSurveyProps {
  onComplete: (answers: SurveyAnswers) => void;
}

const SURVEY_QUESTIONS: Question[] = [
  {
    id: "vibe",
    question: "What kind of vibe are you looking for?",
    type: "multiple_choice",
    options: [
      { value: "historical", label: "Historical & Ancient" },
      { value: "cultural", label: "Cultural & Traditional" },
      { value: "modern", label: "Modern & Contemporary" },
      { value: "nature", label: "Nature & Outdoors" },
      { value: "shopping", label: "Shopping & Markets" },
      { value: "romantic", label: "Romantic" },
      { value: "photography", label: "Photography Spots" },
      { value: "adventure", label: "Adventure & Activities" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget level?",
    type: "single_choice",
    options: [
      { value: "low", label: "Budget-friendly (Free - 100 EGP)" },
      { value: "medium", label: "Moderate (100 - 500 EGP)" },
      { value: "high", label: "Premium (500+ EGP)" },
    ],
  },
  {
    id: "time",
    question: "How much time do you have?",
    type: "range",
    min: 0,
    max: 12,
    step: 1,
    unit: "hours",
  },
  {
    id: "companions",
    question: "Who are you traveling with?",
    type: "multiple_choice",
    options: [
      { value: "kids", label: "Kids" },
      { value: "pets", label: "Pets" },
      { value: "elderly", label: "Elderly" },
      { value: "solo", label: "Solo" },
      { value: "group", label: "Group/Friends" },
      { value: "partner", label: "Partner" },
    ],
  },
  {
    id: "timeOfDay",
    question: "What time do you prefer to visit?",
    type: "multiple_choice",
    options: [
      { value: "morning", label: "Morning (6am - 12pm)" },
      { value: "afternoon", label: "Afternoon (12pm - 6pm)" },
      { value: "evening", label: "Evening (6pm - 10pm)" },
      { value: "night", label: "Night (10pm+)" },
    ],
  },
  {
    id: "numberOfPlaces",
    question: "How many places would you like to visit?",
    type: "range",
    min: 0,
    max: 10,
    step: 1,
    unit: "places",
  },
];

export default function AccordionSurvey({ onComplete }: AccordionSurveyProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(SURVEY_QUESTIONS[0].id);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  // Toggle accordion
  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(prev => (prev === questionId ? null : questionId));
  };

  // Helpers
  const isAnswered = (questionId: string) => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== undefined && answer !== null;
  };

  const allAnswered = SURVEY_QUESTIONS.every(q => isAnswered(q.id));

  // Handlers
  const handleSingleChoice = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    // Auto-open next unanswered question
    const currentIndex = SURVEY_QUESTIONS.findIndex(q => q.id === questionId);
    if (currentIndex < SURVEY_QUESTIONS.length - 1) {
      const nextQuestion = SURVEY_QUESTIONS[currentIndex + 1];
      if (!answers[nextQuestion.id]) {
        setOpenQuestion(nextQuestion.id);
      }
    }
  };

  const handleMultipleChoice = (questionId: string, value: string) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [questionId]: updated };
    });
  };

  const handleRangeChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (allAnswered) onComplete(answers);
  };

  // Calculate progress
  const answeredCount = Object.keys(answers).filter(id => isAnswered(id)).length;
  const progressPercent = Math.round((answeredCount / SURVEY_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/backgrounds/survey.jpg)',
            backgroundColor: '#5d4e37', // fallback
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-32 pb-12">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Plan Your Perfect Trip
            </h1>
            <p className="font-cinzel text-white text-lg font-bold max-w-2xl mx-auto drop-shadow-md">
              Answer a few questions to get personalized recommendations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3 text-white">
              <span className="font-bold">{answeredCount} of {SURVEY_QUESTIONS.length} answered</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#5d4e37]/80 rounded-full h-3 shadow-lg">
              <div
                className="bg-[#d4af37] h-3 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-4 mb-8">
            {SURVEY_QUESTIONS.map((q, index) => {
              const isOpen = openQuestion === q.id;
              const answered = isAnswered(q.id);
              const currentAnswer = answers[q.id];

              return (
                <div
                  key={q.id}
                  className={`bg-white/10 backdrop-blur-sm rounded-lg border-2 transition-all ${
                    isOpen
                      ? "border-[#d4af37] shadow-lg shadow-[#d4af37]/20"
                      : answered
                      ? "border-[#8b6f47]"
                      : "border-[#5d4e37]"
                  }`}
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        answered ? "bg-[#d4af37] text-[#3a3428]" : "bg-[#5d4e37] text-white"
                      }`}>
                        {answered ? "✓" : index + 1}
                      </div>
                      <span className="font-cinzel text-white font-semibold text-lg">{q.question}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-[#5d4e37] flex items-center justify-center transition-transform ${isOpen ? "rotate-45" : ""}`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>

                  {/* Content */}
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2">
                      {/* Single Choice */}
                      {q.type === "single_choice" && q.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => handleSingleChoice(q.id, opt.value)}
                              className={`p-4 rounded-lg text-left transition-all ${
                                currentAnswer === opt.value
                                  ? "bg-[#d4af37] text-[#3a3428] ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#3a3428]"
                                  : "bg-[#5d4e37] text-white hover:bg-[#6d5e47]"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Multiple Choice */}
                      {q.type === "multiple_choice" && q.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map(opt => {
                            const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(opt.value);
                            return (
                              <button
                                key={opt.value}
                                onClick={() => handleMultipleChoice(q.id, opt.value)}
                                className={`p-4 rounded-lg text-left transition-all ${
                                  isSelected
                                    ? "bg-[#d4af37] text-[#3a3428] ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#3a3428]"
                                    : "bg-[#5d4e37] text-white hover:bg-[#6d5e47]"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? "border-[#3a3428] bg-[#3a3428]" : "border-white"}`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  {opt.label}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Range */}
                      {q.type === "range" && (
                        <div className="space-y-6">
                          <div className="text-center">
                            <span className="text-5xl font-bold text-[#d4af37]">{currentAnswer || q.min || 0}</span>
                            <span className="text-2xl text-white ml-2">{q.unit}</span>
                          </div>
                          <input
                            type="range"
                            min={q.min || 0}
                            max={q.max || 100}
                            step={q.step || 1}
                            value={(currentAnswer as number) || q.min || 0}
                            onChange={(e) => handleRangeChange(q.id, Number(e.target.value))}
                            className="w-full h-3 bg-[#5d4e37] rounded-lg appearance-none cursor-pointer slider"
                            style={{
                              background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${
                                (((currentAnswer as number) || q.min || 0) - (q.min || 0)) /
                                ((q.max || 100) - (q.min || 0)) * 100
                              }%, #5d4e37 ${(((currentAnswer as number) || q.min || 0) - (q.min || 0)) /
                                ((q.max || 100) - (q.min || 0)) * 100}%, #5d4e37 100%)`,
                            }}
                          />
                          <div className="flex justify-between text-white/70 text-sm">
                            <span>{q.min} {q.unit}</span>
                            <span>{q.max} {q.unit}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-12 py-4 bg-[#d4af37] text-[#3a3428] rounded font-bold hover:bg-[#e5bf47] transition-all disabled:opacity-50"
            >
              {allAnswered ? "Get My Recommendations →" : `Answer ${SURVEY_QUESTIONS.length - answeredCount} More Questions`}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          border: 3px solid #3a3428;
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          border: 3px solid #3a3428;
        }
      `}</style>
    </div>
  );
}
