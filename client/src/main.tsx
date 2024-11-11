import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Home } from "./pages/Home";
import { QuestionDetail } from "./pages/QuestionDetail";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <SWRConfig 
        value={{ 
          fetcher,
          onError: (error) => {
            console.error('SWR Global Error:', error);
          }
        }}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/question/:id" component={QuestionDetail} />
              <Route>404 Page Not Found</Route>
            </Switch>
          </main>
          <Footer />
          <Toaster />
        </div>
      </SWRConfig>
    </ErrorBoundary>
  </StrictMode>
);
