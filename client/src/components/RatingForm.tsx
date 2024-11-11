import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mutate } from "swr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const ratingDescriptions = {
  1: "Réponse incorrecte ou trompeuse",
  2: "Réponse partiellement correcte mais manquant de détails ou précision",
  3: "Réponse correcte avec quelques détails manquants",
  4: "Réponse complète et précise"
};

const ratingSchema = z.object({
  note: z.number().min(1).max(4),
  commentaire: z.string().optional(),
  evaluateur: z.string().min(1, "Le nom de l'évaluateur est requis"),
});

type RatingFormValues = z.infer<typeof ratingSchema>;

interface RatingFormProps {
  answerId: number;
}

export function RatingForm({ answerId }: RatingFormProps) {
  const { toast } = useToast();
  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      note: 4,
      commentaire: "",
      evaluateur: "",
    },
  });

  async function onSubmit(data: RatingFormValues) {
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, reponseId: answerId }),
      });

      mutate(`/api/answers/${answerId}`);
      toast({
        title: "Évaluation soumise",
        description: "Merci pour votre retour !",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'envoi de l'évaluation",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Note (1-4)</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <ul className="space-y-2">
                        {Object.entries(ratingDescriptions).map(([rating, description]) => (
                          <li key={rating}>
                            <strong>{rating} point{rating !== '1' ? 's' : ''}</strong> : {description}
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={4}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Survolez l'icône d'aide pour voir la description des notes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="evaluateur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Évaluateur</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commentaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaire (optionnel)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Soumettre l'évaluation</Button>
      </form>
    </Form>
  );
}
