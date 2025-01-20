import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import "./styles/ps2-theme.css";
import { useState } from "react";
import { PS2BootSequence } from "@/components/custom/ps2-boot-sequence";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showBootSequence, setShowBootSequence] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {showBootSequence ? (
        <PS2BootSequence onComplete={() => setShowBootSequence(false)} />
      ) : (
        <>
          <Router />
          <Toaster />
        </>
      )}
    </QueryClientProvider>
  );
}

export default App;