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


