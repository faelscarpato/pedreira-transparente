import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ReportsPage from "./pages/ReportsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagementPage from "./pages/AdminManagementPage";
import SubscribePage from "./pages/SubscribePage";
import StatisticsPage from "./pages/StatisticsPage";
import ComplaintTrackingPage from "./pages/ComplaintTrackingPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/reports"} component={ReportsPage} />
      <Route path={"/complaints/new"} component={ComplaintsPage} />
      <Route path={"/subscribe"} component={SubscribePage} />
      <Route path={"/statistics"} component={StatisticsPage} />
      <Route path={"/track"} component={ComplaintTrackingPage} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin-management"} component={AdminManagementPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
