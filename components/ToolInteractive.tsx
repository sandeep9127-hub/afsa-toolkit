import StakeholderGrid from "@/components/interactives/StakeholderGrid";
import VillageMatrix from "@/components/interactives/VillageMatrix";
import TransectStrip from "@/components/interactives/TransectStrip";
import DqqQuiz from "@/components/interactives/DqqQuiz";
import KiiCards from "@/components/interactives/KiiCards";
import SeasonalGrid from "@/components/interactives/SeasonalGrid";
import ServiceMap from "@/components/interactives/ServiceMap";
import LivelihoodSlider from "@/components/interactives/LivelihoodSlider";
import HouseholdCards from "@/components/interactives/HouseholdCards";
import FoodChain from "@/components/interactives/FoodChain";
import MarketScene from "@/components/interactives/MarketScene";
import ScorecardRadar from "@/components/interactives/ScorecardRadar";
import CausalLoopDiagram from "@/components/interactives/CausalLoopDiagram";
import VisionVoices from "@/components/interactives/VisionVoices";

const REGISTRY: Record<string, React.ComponentType> = {
  "stakeholder-grid": StakeholderGrid,
  "village-matrix": VillageMatrix,
  "transect-strip": TransectStrip,
  "dqq-quiz": DqqQuiz,
  "kii-cards": KiiCards,
  "seasonal-grid": SeasonalGrid,
  "service-map": ServiceMap,
  "livelihood-slider": LivelihoodSlider,
  "household-cards": HouseholdCards,
  "food-chain": FoodChain,
  "market-scene": MarketScene,
  "scorecard-radar": ScorecardRadar,
  "causal-loop-diagram": CausalLoopDiagram,
  "vision-voices": VisionVoices,
};

export default function ToolInteractive({ id }: { id: string }) {
  const Component = REGISTRY[id];
  return Component ? <Component /> : null;
}
