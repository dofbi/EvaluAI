import { MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Header() {
  return (
    <header className="border-b py-4">
      <Container>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Q&A Management System</span>
        </div>
      </Container>
    </header>
  );
}
