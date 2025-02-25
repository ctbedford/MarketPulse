import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import PathformanceLogo from "@/components/PathformanceLogo";

function Navigation() {
  return (
    <header className="border-b border-border bg-background py-3 px-4">
      <div className="flex items-center justify-between">
        <PathformanceLogo 
          variant="secondary" 
          size="md" 
          primaryLogoSrc="/logos/pathformance-logo-primary.png"
          secondaryLogoSrc="/logos/pathformance-logo-secondary.png"
        />
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Campaigns</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Analytics</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Reports</a>
          </nav>
          <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
