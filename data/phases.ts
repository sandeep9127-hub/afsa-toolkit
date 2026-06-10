export type Phase = {
  id: string;
  num: string;
  name: string;
  tagline: string;
  timeline: string;
  color: string; // tailwind utility stem used for phase coding
  objectives: string[];
  toolSlugs: string[];
};

export const PHASES: Phase[] = [
  {
    id: "pre-phase",
    num: "0",
    name: "Pre-Phase: Preparation",
    tagline: "Choose where to work, with whom — and get the ground ready.",
    timeline: "Month 1",
    color: "peri-light",
    objectives: [
      "Define the landscape boundary: a coherent village cluster, watershed or block where transformation is possible",
      "Identify the actors who shape the food system — and who it shapes",
      "Select representative villages and a stratified community sample",
      "Form the field team and make pre-exercise arrangements with the community",
    ],
    toolSlugs: ["stakeholder-mapping", "village-selection"],
  },
  {
    id: "scoping",
    num: "1",
    name: "Phase 1: Scoping",
    tagline: "Understand the landscape and its people — what works, what doesn't, and why.",
    timeline: "Month 1",
    color: "peri",
    objectives: [
      "Establish a baseline of existing assets, constraints and priorities",
      "Understand dietary practices, production practices and market dependence",
      "Understand land use, food system governance and natural resource management",
    ],
    toolSlugs: ["transect-walk", "dqq", "kii"],
  },
  {
    id: "diagnosing",
    num: "2",
    name: "Phase 2: Diagnosing",
    tagline: "Build the community's narrative of how the system functions — and malfunctions.",
    timeline: "Months 1–2",
    color: "teal",
    objectives: [
      "Deepen understanding of how the food system works — and why it produces current outcomes",
      "Identify causal dynamics, power imbalances and feedback loops",
      "Map access to food, land, labour, services and decision-making",
      "Identify leverage points for transformation",
    ],
    toolSlugs: [
      "seasonal-calendar",
      "service-mapping",
      "livelihood-shift",
      "rapid-survey",
      "track-a-food",
      "market-walk",
      "scorecard",
      "causal-loop",
    ],
  },
  {
    id: "visioning",
    num: "3",
    name: "Phase 3: Visioning",
    tagline: "From diagnosis to collective imagination: the future the community wants to build.",
    timeline: "Months 2–3",
    color: "rose",
    objectives: [
      "Facilitate reflection on community aspirations, values and priorities",
      "Co-create a vision rooted in agroecological principles",
      "Identify community-defined leverage points and goals",
      "Initiate consensus around shared commitments and next steps",
    ],
    toolSlugs: ["visioning"],
  },
];

export const phaseById = (id: string) => PHASES.find((p) => p.id === id)!;
