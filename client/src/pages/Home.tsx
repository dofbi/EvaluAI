import { useState } from "react";
import { QuestionList } from "@/components/QuestionList";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useSWR from "swr";

export function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  
  const { data, error } = useSWR(`/api/questions?page=${currentPage}&limit=25&langue=${selectedLanguage}`);

  // Get unique languages from questions for the dropdown
  const languages = Array.from(new Set((data?.list || []).map((q: any) => q.langue)))
    .filter(lang => lang); // Filter out any undefined or empty values

  // Reset to page 1 when language changes
  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    setCurrentPage(1);
  };

  const questions = data?.list || [];
  const pageInfo = data?.pageInfo || { totalPages: 1 };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 sticky top-0 bg-white z-10">
        <CardHeader>
          <CardTitle>Q&R IA - élections législatives au Sénégal</CardTitle>
          <CardDescription>
            Parcourir les questions et réponses, fournir des évaluations et des commentaires
          </CardDescription>
          <div className="mt-4">
            <Select
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
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

      {error ? (
        <div>Impossible de charger les questions</div>
      ) : !data ? (
        <div>Chargement...</div>
      ) : (
        <>
          <QuestionList questions={questions} />
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Page précédente
            </Button>
            <span className="py-2 px-4 text-sm">
              Page {currentPage} sur {pageInfo.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(pageInfo.totalPages, p + 1))}
              disabled={currentPage === pageInfo.totalPages}
            >
              Page suivante
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
