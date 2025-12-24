import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import Landing from "./pages/Landing";
import EditorWithImages from './pages/EditorWithImages';
import HelpModal from '@/components/HelpModal';

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path="/editor" component={EditorWithImages} />
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
        <HelpModal />
      </TooltipProvider>
    </div>
  );
}

export default App;
