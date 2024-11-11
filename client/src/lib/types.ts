export interface QuestionWithAnswers {
  question: {
    Id: number;
    Question: string;
    langue: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  answers: Answer[];
}

export interface Answer {
  Id: number;
  Réponse: string;
  Source: string;
  Questions: number; // Changed from questionId to Questions
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Note {
  Id: number;
  Note: number;
  Commentaire: string | null;
  reponseId: number;
  Evaluateur: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface AnswerWithNotes {
  answer: Answer;
  notes: Note[];
  averageRating: number | null;
  totalRatings: number;
}
