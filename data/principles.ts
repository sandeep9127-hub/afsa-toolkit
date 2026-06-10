// The 13 HLPE Agroecology Principles — the complete, closed set used by AFSA.
// Rubric anchors are condensed from the Agroecology Principles Scorecard (Annex 11),
// which is itself based on the FAO TAPE tool.

export type Principle = {
  id: string;
  num: number;
  name: string;
  short: string;
  description: string;
  indicators: string[];
  anchor0: string; // what a score of 0 looks like
  anchor4: string; // what a score of 4 looks like
  tools: string[]; // slugs of tools that assess this principle
  cluster: "diversity" | "circularity" | "interconnection" | "adaptation" | "solidarity";
};

export const CLUSTERS: Record<Principle["cluster"], string> = {
  diversity: "Diversity & synergy",
  circularity: "Circularity & flow",
  interconnection: "Interconnectedness & reciprocity",
  adaptation: "Adaptation & emergence",
  solidarity: "Solidarity & inclusiveness",
};

export const PRINCIPLES: Principle[] = [
  {
    id: "recycling",
    num: 1,
    name: "Recycling",
    short: "Nutrients, biomass and water cycle back into the system instead of leaking out.",
    description:
      "Preferentially use local renewable resources and close resource cycles of nutrients and biomass — crop residues become compost or fodder, manure returns to the soil, waste finds a use.",
    indicators: ["Recycling and the scope of circular use of nutrients"],
    anchor0:
      "No integration: animals are fed purchased feed and their manure is not used for soil fertility — or there are no animals in the agroecosystem at all.",
    anchor4:
      "Complete integration: animals are fed entirely from the farm, all manure is recycled as fertiliser, animals provide multiple services, and all crop residues are mulched or composted.",
    tools: ["transect-walk", "rapid-survey", "track-a-food"],
    cluster: "circularity",
  },
  {
    id: "input-reduction",
    num: 2,
    name: "Input Reduction",
    short: "The system runs on its own seeds, breeds and inputs, not on the market's.",
    description:
      "Reduce or eliminate dependency on purchased inputs. Looks at who controls seeds and breeds, and how much of the fertiliser, feed, energy and crop protection is produced within the community.",
    indicators: ["Management of seeds and breeds", "Use of external inputs"],
    anchor0:
      "All seeds, breeds and inputs — fertilisers, pesticides, feed, mulch — are purchased from the market.",
    anchor4:
      "Seeds and breeds are self-produced, exchanged or collectively managed with seed banks in place; all inputs are produced within the agroecosystem or exchanged in the community.",
    tools: ["transect-walk", "seasonal-calendar", "rapid-survey", "track-a-food", "kii"],
    cluster: "circularity",
  },
  {
    id: "soil-health",
    num: 3,
    name: "Soil Health",
    short: "Living, covered, undisturbed soil is the foundation of the food system.",
    description:
      "Secure and enhance soil health for improved plant growth — soil cover, rotations and intercropping, locally produced manure and compost, soil-water conservation and minimal disturbance.",
    indicators: ["Manure, cover crops and rotations", "Watershed development"],
    anchor0:
      "Soil is bare after harvest, continuous monocropping, little or no locally produced manure applied, heavy soil disturbance and no soil-water conservation.",
    anchor4:
      "Soil is always covered, rotation and intercropping are common, improved composting is practised, soil testing is periodic, and watershed structures (bunds, check dams, contour work) protect most areas.",
    tools: ["seasonal-calendar", "rapid-survey", "livelihood-shift"],
    cluster: "circularity",
  },
  {
    id: "animal-health",
    num: 4,
    name: "Animal Health",
    short: "Animals are fed, sheltered, healthy and treated with care.",
    description:
      "Ensure animal health and welfare — year-round feed and water, clean shelter, access to veterinary services and humane treatment through to slaughter.",
    indicators: ["Animal health and welfare"],
    anchor0:
      "Animals suffer hunger, thirst, stress and disease all year; no health services exist and animals have no shelter.",
    anchor4:
      "Animals are free of hunger, stress and disease, shelters are cleaned and disinfected regularly, and a hospital with regular health services is available.",
    tools: ["transect-walk", "seasonal-calendar", "kii"],
    cluster: "diversity",
  },
  {
    id: "biodiversity",
    num: 5,
    name: "Biodiversity",
    short: "Many crops, varieties, trees, insects and wild foods — not a monoculture.",
    description:
      "Maintain and enhance diversity of species, varieties and resources at field and landscape level — diverse cropping, gardens and trees, and pest management that lets pollinators thrive.",
    indicators: ["Crop diversity and cropping intensity", "Management of pests & diseases"],
    anchor0:
      "Monoculture with 100% cropping intensity, no gardens or trees; chemical pesticides used regularly and no bees or butterflies seen on the village walk.",
    anchor4:
      "More than three locally adapted crops with inter/poly-cropping, gardens and agroforestry in most households; pests managed through prevention and biological means, with insects, birds and wildlife visibly present.",
    tools: ["transect-walk", "dqq", "kii", "livelihood-shift", "rapid-survey"],
    cluster: "diversity",
  },
  {
    id: "economic-diversification",
    num: 6,
    name: "Economic Diversification",
    short: "Many income streams, on-farm and off, keep households resilient.",
    description:
      "Diversify on-farm incomes and sources of livelihood — multiple productive activities, value addition, services and skills, so no single failure breaks the household economy.",
    indicators: ["Diversity of activities, products and services"],
    anchor0:
      "One productive activity only — households rely on a single crop's income for the whole year.",
    anchor4:
      "More than half of households combine three or four productive activities with several services such as processing, retail, transport or training.",
    tools: ["transect-walk", "seasonal-calendar", "kii", "track-a-food", "livelihood-shift", "rapid-survey", "market-walk"],
    cluster: "diversity",
  },
  {
    id: "synergies",
    num: 7,
    name: "Synergies",
    short: "Crops, animals, trees, water and commons work as one connected system.",
    description:
      "Enhance positive interaction and complementarity among the elements of the agroecosystem — and between the farm and the semi-natural landscape around it: ponds, hedges, forests and commons.",
    indicators: ["Connectivity between elements of the agroecosystem and the landscape"],
    anchor0:
      "High uniformity inside and outside the agroecosystem — no semi-natural elements, water bodies hold water only in the rains, no forest or common lands.",
    anchor4:
      "A diversified landscape where trees, fences and ponds sit between plots, water bodies hold water year-round, and forest and commons provide food, fodder and income under sustainable harvesting.",
    tools: ["transect-walk", "kii", "seasonal-calendar", "track-a-food", "livelihood-shift", "rapid-survey"],
    cluster: "diversity",
  },
  {
    id: "co-creation",
    num: 8,
    name: "Co-creation of Knowledge",
    short: "Farmers create and exchange knowledge horizontally, not just receive it.",
    description:
      "Enhance co-creation and horizontal sharing of knowledge — local and scientific innovation exchanged through farmer groups, platforms, community resource persons and inclusive extension.",
    indicators: ["Processes for horizontal creation and transfer of knowledge"],
    anchor0:
      "No platforms or processes for knowledge sharing exist; producers depend on the local input dealer for advice.",
    anchor4:
      "Several functioning platforms — including women — share knowledge; farmer trainers and community resource persons are active, with regular agroecological advisories.",
    tools: ["stakeholder-mapping", "kii", "market-walk"],
    cluster: "adaptation",
  },
  {
    id: "social-values-diets",
    num: 9,
    name: "Social Values & Diets",
    short: "Food systems rooted in local culture deliver healthy, diverse diets.",
    description:
      "Build food systems on the culture, identity and social values of local communities — providing healthy, diversified, culturally appropriate diets with a strong local food economy.",
    indicators: ["Appropriate diet and nutrition awareness", "Local food system"],
    anchor0:
      "Systematic insufficiency of food and no awareness of good nutrition; community is wholly dependent on outside supply, marketing and processing.",
    anchor4:
      "Healthy, diverse diets year-round with well-known nutrition practices; the community is largely self-sufficient with strong local exchange and locally sourced processing.",
    tools: ["seasonal-calendar", "dqq", "service-mapping", "track-a-food"],
    cluster: "solidarity",
  },
  {
    id: "fairness",
    num: 10,
    name: "Fairness",
    short: "Dignified work, fair wages and a fair share of the burden — especially for women.",
    description:
      "Support dignified and robust livelihoods for all actors — fair working conditions, equal wages, a fair division of labour between men and women, and freedom from distress migration.",
    indicators: ["Productive conditions and social inequalities, particularly gender"],
    anchor0:
      "Hard working conditions, unequal and irregular wages, and migration that leaves women solely responsible for farming.",
    anchor4:
      "Equal wages and a balanced division of work between men and women; wage work is available most of the year and there is little or no distress migration.",
    tools: ["seasonal-calendar", "livelihood-shift", "rapid-survey", "service-mapping", "track-a-food"],
    cluster: "solidarity",
  },
  {
    id: "participation",
    num: 11,
    name: "Participation",
    short: "Communities — including women and vulnerable groups — shape the decisions that shape them.",
    description:
      "Encourage social organisation and greater participation in decision-making — communities as genuine actors in local planning, monitoring and governance, not token attendees.",
    indicators: ["Participation of community in governance decision-making"],
    anchor0: "No local planning or monitoring of public processes exists.",
    anchor4:
      "Communities — with equal participation of women and vulnerable groups — are part of decision-making and monitoring of governance and local planning.",
    tools: ["stakeholder-mapping", "kii", "service-mapping", "track-a-food"],
    cluster: "solidarity",
  },
  {
    id: "land-governance",
    num: 12,
    name: "Land & Natural Resource Governance",
    short: "Communities hold real, recognised control over land, water, forests and seeds.",
    description:
      "Recognise and support smallholders and communities as sustainable managers and guardians of natural and genetic resources — active, representative groups governing seeds, forests, commons and water.",
    indicators: ["Access to and control over productive resources"],
    anchor0: "No community groups exist to manage local natural resources.",
    anchor4:
      "Active community groups with equal decision-making for women and all social groups manage seed banks, forests, commons and water — and are recognised by local government.",
    tools: ["stakeholder-mapping", "transect-walk", "kii"],
    cluster: "interconnection",
  },
  {
    id: "connectivity",
    num: 13,
    name: "Connectivity",
    short: "Producers and consumers connect directly through fair, local market networks.",
    description:
      "Ensure proximity and confidence between producers and consumers — producer networks and collectives that re-embed food systems in local economies and reduce dependence on intermediaries.",
    indicators: ["Networks of producers, relationship with consumers and presence of intermediaries"],
    anchor0:
      "No producer networks exist; intermediaries control the entire marketing process and producers don't even know the market rate.",
    anchor4:
      "Well-established networks with equal participation of women; strong, stable trading relationships where farmers participate in price setting.",
    tools: ["stakeholder-mapping", "kii", "service-mapping", "track-a-food", "market-walk"],
    cluster: "interconnection",
  },
];

export const principleById = (id: string) => PRINCIPLES.find((p) => p.id === id)!;
