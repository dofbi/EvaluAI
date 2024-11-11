import { useParams } from "wouter";
import useSWR from "swr";
import { AnswerList } from "@/components/AnswerList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import type { QuestionWithAnswers } from "@/lib/types";

export function QuestionDetail() {
  const { id } = useParams();
  const { data, error } = useSWR<QuestionWithAnswers>(`/api/questions/${id}`);

  if (error) return <div>Failed to load question</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour aux questions
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{data.question.Question}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Langue: {data.question.langue}
          </div>
        </CardHeader>
        <CardContent>
          <AnswerList answers={data.answers} />
        </CardContent>
      </Card>
    </div>
  );
}
