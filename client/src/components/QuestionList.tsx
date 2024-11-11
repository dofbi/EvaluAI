import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface Question {
  Id: number;
  Question: string;
  langue: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {questions.map((question) => (
        <Link key={question.Id} href={`/question/${question.Id}`}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{question.Question}</CardTitle>
              <div className="text-sm text-muted-foreground">
                Langue: {question.langue}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Créé le: {new Date(question.CreatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
