import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import Header from "./components/header";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Auth from "./pages/auth";
import ImageResizer from "./pages/tools/image-resizer";
import PngToJpg from "./pages/tools/png-to-jpg";
import PngToSvg from "./pages/tools/png-to-svg";
import WebpToPng from "./pages/tools/webp-to-png";
import HeicToJpg from "./pages/tools/heic-to-jpg";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/tools/resize" component={ImageResizer} />
        <Route path="/tools/png-to-jpg" component={PngToJpg} />
        <Route path="/tools/png-to-svg" component={PngToSvg} />
        <Route path="/tools/webp-to-png" component={WebpToPng} />
        <Route path="/tools/heic-to-jpg" component={HeicToJpg} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
