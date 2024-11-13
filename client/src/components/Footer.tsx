import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t mt-auto py-6">
      <Container>
        <div className="text-center text-sm text-muted-foreground">
          © 2024 <a href="https://africtivistes.com" target="_blank">AfricTivistes</a> Q&A IA content Management System. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
