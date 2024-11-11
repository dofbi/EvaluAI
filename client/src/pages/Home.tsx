import { useState } from "react";
import { QuestionList } from "@/components/QuestionList";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useSWR from "swr";

export function Home() {
  const { data: questions, error } = useSWR("/api/questions");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  if (error) return <div>Failed to load questions</div>;
  if (!questions) return <div>Loading...</div>;

  // Get unique languages from questions
  const languages = Array.from(new Set(questions.map((q: any) => q.langue)));

  // Filter questions based on selected language
  const filteredQuestions = selectedLanguage === "all" 
    ? questions 
    : questions.filter((q: any) => q.langue === selectedLanguage);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Système de Gestion Q&R</CardTitle>
          <CardDescription>
            Parcourir les questions et réponses, fournir des évaluations et des commentaires
          </CardDescription>
          <div className="mt-4">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les langues</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>
      
      <QuestionList questions={filteredQuestions} />
    </div>
  );
}
