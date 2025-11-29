import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import Landing from "./pages/Landing";
import EditorFinal from './pages/EditorFinal';

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path="/editor" component={EditorFinal} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="dark">
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </div>
  );
}

export default App;
