import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/layout/Layout";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import LookDetail from "./pages/LookDetail";
import StartOrder from "./pages/StartOrder";
import Appointment from "./pages/Appointment";
import OurStory from "./pages/OurStory";
import ComeSeeUs from "./pages/ComeSeeUs";
import WeddingParties from "./pages/WeddingParties";
import Bag from "./pages/Bag";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import Faqs from "./pages/Faqs";
import Journal from "./pages/Journal";
import JournalPost from "./pages/JournalPost";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/collection/:id" element={<LookDetail />} />
              <Route path="/start-your-order" element={<StartOrder />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/come-see-us" element={<ComeSeeUs />} />
              <Route path="/wedding-parties" element={<WeddingParties />} />
              <Route path="/bag" element={<Bag />} />
              <Route path="/order/:reference" element={<OrderConfirmation />} />
              <Route path="/account" element={<Account />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<JournalPost />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
