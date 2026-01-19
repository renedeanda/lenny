export type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7';

export type AnswerId = 'a' | 'b' | 'c';

export interface Answer {
  id: AnswerId;
  text: string;
  icon: string; // emoji
}

export interface Question {
  id: QuestionId;
  number: number;
  text: string;
  answers: Answer[];
}

export interface QuizAnswers {
  [key: string]: AnswerId;
}

export type ZoneId =
  | 'velocity'
  | 'perfection'
  | 'discovery'
  | 'data'
  | 'intuition'
  | 'alignment'
  | 'chaos'
  | 'focus';

export interface ZoneScores {
  [key: string]: number;
}
