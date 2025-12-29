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

  const handleSingleChoice = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
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
    const current = (answers[questionId] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [questionId]: updated });
  };

  const handleRangeChange = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  const isAnswered = (questionId: string) => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== undefined && answer !== null;
  };

  const allAnswered = SURVEY_QUESTIONS.every(q => isAnswered(q.id));

  const handleSubmit = () => {
    if (allAnswered) {
      onComplete(answers);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/backgrounds/survey.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#5d4e37' // Fallback color
          }}
        />
        {/* Overlay for readability - gradient overlay like search page */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-32 pb-12">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Plan Your Perfect Trip
            </h1>
            <p className="font-cinzel text-white text-lg font-bold max-w-2xl mx-auto drop-shadow-md" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Answer a few questions to help us create personalized recommendations just for you
            </p>
          </div>

        {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-cinzel text-white text-base font-bold drop-shadow-md" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                {Object.keys(answers).filter(id => isAnswered(id)).length} of {SURVEY_QUESTIONS.length} answered
              </span>
              <span className="font-cinzel text-white text-base font-bold drop-shadow-md" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                {Math.round((Object.keys(answers).filter(id => isAnswered(id)).length / SURVEY_QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#5d4e37]/80 rounded-full h-3 shadow-lg">
              <div
                className="bg-[#d4af37] h-3 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${(Object.keys(answers).filter(id => isAnswered(id)).length / SURVEY_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

        {/* Accordion Questions */}
        <div className="space-y-4 mb-8">
          {SURVEY_QUESTIONS.map((question, index) => {
            const isOpen = openQuestion === question.id;
            const answered = isAnswered(question.id);
            const currentAnswer = answers[question.id];

            return (
              <div
                key={question.id}
                className={`bg-white/10 backdrop-blur-sm rounded-lg border-2 transition-all ${
                  isOpen
                    ? "border-[#d4af37] shadow-lg shadow-[#d4af37]/20"
                    : answered
                    ? "border-[#8b6f47]"
                    : "border-[#5d4e37]"
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleQuestion(question.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      answered ? "bg-[#d4af37] text-[#3a3428]" : "bg-[#5d4e37] text-white"
                    }`}>
                      {answered ? "✓" : index + 1}
                    </div>
                    <span className="font-cinzel text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {question.question}
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-[#5d4e37] flex items-center justify-center transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                {/* Question Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2">
                    {/* Single Choice */}
                    {question.type === "single_choice" && question.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSingleChoice(question.id, option.value)}
                            className={`p-4 rounded-lg text-left transition-all ${
                              currentAnswer === option.value
                                ? "bg-[#d4af37] text-[#3a3428] ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#3a3428]"
                                : "bg-[#5d4e37] text-white hover:bg-[#6d5e47]"
                            }`}
                          >
                            <span className="font-cinzel font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Multiple Choice */}
                    {question.type === "multiple_choice" && question.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.options.map((option) => {
                          const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleMultipleChoice(question.id, option.value)}
                              className={`p-4 rounded-lg text-left transition-all ${
                                isSelected
                                  ? "bg-[#d4af37] text-[#3a3428] ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#3a3428]"
                                  : "bg-[#5d4e37] text-white hover:bg-[#6d5e47]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    isSelected ? "border-[#3a3428] bg-[#3a3428]" : "border-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <svg className="w-3 h-3 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
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
                          onChange={(e) => handleRangeChange(question.id, Number(e.target.value))}
                          className="w-full h-3 bg-[#5d4e37] rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${
                              (((currentAnswer as number) || question.min || 0) - (question.min || 0)) /
                              ((question.max || 100) - (question.min || 0)) * 100
                            }%, #5d4e37 ${
                              (((currentAnswer as number) || question.min || 0) - (question.min || 0)) /
                              ((question.max || 100) - (question.min || 0)) * 100
                            }%, #5d4e37 100%)`,
                          }}
                        />
                        <div className="flex justify-between text-white/70 font-cinzel text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                          <span>{question.min} {question.unit}</span>
                          <span>{question.max} {question.unit}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-12 py-4 bg-[#d4af37] text-[#3a3428] rounded-lg font-cinzel font-bold text-lg hover:bg-[#e5bf47] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            {allAnswered ? "Get My Recommendations →" : `Answer ${SURVEY_QUESTIONS.length - Object.keys(answers).filter(id => isAnswered(id)).length} More Questions`}
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

