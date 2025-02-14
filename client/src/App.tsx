import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import KnowledgeBase from "@/pages/knowledge-base";
import { useState } from "react";
import { BootSequence } from "@/components/custom/boot-sequence";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showBootSequence, setShowBootSequence] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {showBootSequence ? (
        <BootSequence onComplete={() => setShowBootSequence(false)} />
      ) : (
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <Router />
          </main>
          <Toaster />
        </div>
      )}
    </QueryClientProvider>
  );
}

export default App;