import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingForm } from "./RatingForm";
import { Star, StarHalf } from "lucide-react";
import type { Answer, Note } from "@/lib/types";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";

interface AnswerListProps {
  answers: Answer[];
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 4 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );
}

export function AnswerList({ answers }: AnswerListProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  
  // Fetch all answer details at once
  const answerDetailsRequests = answers.map(answer => 
    useSWR(`/api/answers/${answer.Id}`)
  );

  if (answers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune réponse disponible pour cette question.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {answers.map((answer, index) => {
        const { data: answerDetails, error, isLoading } = answerDetailsRequests[index];

        return (
          <Card key={answer.Id}>
            <CardHeader>
              <div className="space-y-2">
                <div className="text-lg font-semibold">{answer.Réponse}</div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Source: {answer.Source}
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-32" />
                  ) : error ? (
                    <div className="text-sm text-destructive">Échec du chargement de la note</div>
                  ) : answerDetails?.averageRating !== null ? (
                    <div className="flex items-center gap-2">
                      <StarRating rating={answerDetails.averageRating} />
                      <span className="text-sm font-medium">
                        {answerDetails.averageRating}/4
                        <span className="text-muted-foreground ml-1">
                          ({answerDetails.totalRatings} {answerDetails.totalRatings === 1 ? 'évaluation' : 'évaluations'})
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucune évaluation</div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedAnswerId(
                  selectedAnswerId === answer.Id ? null : answer.Id
                )}
                className="mb-4"
              >
                {selectedAnswerId === answer.Id ? "Masquer les évaluations" : "Voir les évaluations"}
              </Button>
              {selectedAnswerId === answer.Id && answerDetails?.notes && (
                <div className="mt-4 space-y-4">
                  <h4 className="font-semibold">Évaluations individuelles</h4>
                  {answerDetails.notes.map((note: Note) => (
                    <div key={note.Id} className="border-b py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{note.Évaluateur}</span>
                        <div className="flex items-center gap-2">
                          <StarRating rating={note.Note} />
                          <span>{note.Note}/4</span>
                        </div>
                      </div>
                      {note.Commentaire && (
                        <p className="text-sm text-muted-foreground">{note.Commentaire}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              {selectedAnswerId === answer.Id && (
                <div className="w-full">
                  <RatingForm answerId={answer.Id} />
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
