"use client";

import { useState } from "react";

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
}

export interface Question {
  id: string;
  question: string;
  type: "single_choice" | "multiple_choice" | "range";
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface SurveyAnswers {
  [questionId: string]: string | string[] | number;
}

interface SurveyComponentProps {
  onComplete: (answers: SurveyAnswers) => void;
}

const SURVEY_QUESTIONS: Question[] = [
  {
    id: "vibe",
    question: "What kind of vibe are you looking for? (Select all that apply)",
    type: "multiple_choice",
    options: [
      { value: "historical", label: "Historical & Ancient", icon: "🏛️" },
      { value: "cultural", label: "Cultural & Traditional", icon: "🎭" },
      { value: "modern", label: "Modern & Contemporary", icon: "🏙️" },
      { value: "nature", label: "Nature & Outdoors", icon: "🌳" },
      { value: "shopping", label: "Shopping & Markets", icon: "🛍️" },
      { value: "romantic", label: "Romantic", icon: "💕" },
      { value: "photography", label: "Photography Spots", icon: "📸" },
      { value: "adventure", label: "Adventure & Activities", icon: "🎢" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget level?",
    type: "single_choice",
    options: [
      { value: "low", label: "Budget-friendly (Free - 100 EGP)", icon: "💰" },
      { value: "medium", label: "Moderate (100 - 500 EGP)", icon: "💳" },
      { value: "high", label: "Premium (500+ EGP)", icon: "💎" },
    ],
  },
  {
    id: "time",
    question: "How much time do you have?",
    type: "range",
    min: 2,
    max: 12,
    step: 1,
    unit: "hours",
  },
  {
    id: "companions",
    question: "Who are you traveling with?",
    type: "multiple_choice",
    options: [
      { value: "kids", label: "Kids", icon: "👶" },
      { value: "pets", label: "Pets", icon: "🐕" },
      { value: "elderly", label: "Elderly", icon: "👴" },
      { value: "solo", label: "Solo", icon: "🚶" },
      { value: "group", label: "Group/Friends", icon: "👥" },
      { value: "partner", label: "Partner", icon: "💑" },
    ],
  },
  {
    id: "timeOfDay",
    question: "What time do you prefer to visit?",
    type: "multiple_choice",
    options: [
      { value: "morning", label: "Morning (6am - 12pm)", icon: "🌅" },
      { value: "afternoon", label: "Afternoon (12pm - 6pm)", icon: "☀️" },
      { value: "evening", label: "Evening (6pm - 10pm)", icon: "🌆" },
      { value: "night", label: "Night (10pm+)", icon: "🌙" },
    ],
  },
  {
    id: "numberOfPlaces",
    question: "How many places would you like to visit?",
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    unit: "places",
  },
];

export default function SurveyComponent({ onComplete }: SurveyComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  const question = SURVEY_QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === SURVEY_QUESTIONS.length - 1;
  const currentAnswer = answers[question.id];

  const handleSingleChoice = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleMultipleChoice = (value: string) => {
    const current = (answers[question.id] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [question.id]: updated });
  };

  const handleRangeChange = (value: number) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isAnswered = () => {
    const answer = answers[question.id];
    if (question.type === "multiple_choice") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== null;
  };

  return (
    <div className="min-h-screen bg-[#3a3428] flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-cinzel text-white/70 text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Question {currentQuestion + 1} of {SURVEY_QUESTIONS.length}
            </span>
            <span className="font-cinzel text-white/70 text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              {Math.round(((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#5d4e37] rounded-full h-2">
            <div
              className="bg-[#d4af37] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#5d4e37] rounded-lg p-8 shadow-2xl">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            {question.question}
          </h2>

          {/* Single Choice */}
          {question.type === "single_choice" && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSingleChoice(option.value)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    currentAnswer === option.value
                      ? "bg-[#d4af37] text-[#3a3428]"
                      : "bg-[#8b6f47] text-white hover:bg-[#9d7f57]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {option.icon && <span className="text-2xl">{option.icon}</span>}
                    <span className="font-cinzel font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Multiple Choice */}
          {question.type === "multiple_choice" && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleMultipleChoice(option.value)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      isSelected
                        ? "bg-[#d4af37] text-[#3a3428]"
                        : "bg-[#8b6f47] text-white hover:bg-[#9d7f57]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          isSelected ? "border-[#3a3428] bg-[#3a3428]" : "border-white"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {option.icon && <span className="text-2xl">{option.icon}</span>}
                      <span className="font-cinzel font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Range */}
          {question.type === "range" && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="font-cinzel text-5xl font-bold text-[#d4af37]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  {currentAnswer || question.min || 0}
                </span>
                <span className="font-cinzel text-2xl text-white ml-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  {question.unit}
                </span>
              </div>
              <input
                type="range"
                min={question.min || 0}
                max={question.max || 100}
                step={question.step || 1}
                value={(currentAnswer as number) || question.min || 0}
                onChange={(e) => handleRangeChange(Number(e.target.value))}
                className="w-full h-3 bg-[#8b6f47] rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${
                    (((currentAnswer as number) || question.min || 0) - (question.min || 0)) /
                    ((question.max || 100) - (question.min || 0)) * 100
                  }%, #8b6f47 ${
                    (((currentAnswer as number) || question.min || 0) - (question.min || 0)) /
                    ((question.max || 100) - (question.min || 0)) * 100
                  }%, #8b6f47 100%)`,
                }}
              />
              <div className="flex justify-between text-white/70 font-cinzel text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                <span>{question.min} {question.unit}</span>
                <span>{question.max} {question.unit}</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-lg font-cinzel font-semibold transition-all bg-[#8b6f47] text-white hover:bg-[#9d7f57] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isAnswered()}
              className="flex-1 px-6 py-3 rounded-lg font-cinzel font-semibold transition-all bg-[#d4af37] text-[#3a3428] hover:bg-[#e5bf47] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              {isLastQuestion ? "Get Recommendations" : "Next"}
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

