import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CurrencyConverter from "./pages/CurrencyConverter";
import MarketAnalysis from "./pages/MarketAnalysis";
import GlobalMap from "./pages/GlobalMap";
import AiPredictions from "./pages/AiPredictions";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/currency-converter" element={<CurrencyConverter />} />
      <Route path="/market-analysis" element={<MarketAnalysis />} />
      <Route path="/global-map" element={<GlobalMap />} />
      <Route path="/ai-predictions" element={<AiPredictions />} />
      <Route path="/search" element={<Search />} />
      <Route path="/favorites" element={<Favorites />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
