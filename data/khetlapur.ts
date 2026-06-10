// Khetlapur — a fictional composite landscape used as the worked example
// throughout the toolkit. A rainfed village cluster in an eastern-India-style
// watershed, assembled from patterns in the AFSA guidebook. Not a real place.

export const LANDSCAPE = {
  name: "Khetlapur",
  description:
    "A rainfed watershed cluster of 12 villages and ~1,400 households on an undulating plateau — ridge forest at the top, upland millet fields, terraced paddy below, and a seasonal stream feeding farm ponds. Around 60% of households are small and marginal farmers; a third belong to indigenous communities.",
  selectedVillages: ["Khetlapur", "Baniadihi", "Salbani", "Dumurjore"],
};

// ——— Scorecard (the centrepiece dataset) ———
export type Score = { principleId: string; score: number; why: string };

export const SCORES: Score[] = [
  { principleId: "recycling", score: 3, why: "Most livestock graze commons and crop residue; manure returns to fields. But residue burning is appearing on larger plots." },
  { principleId: "input-reduction", score: 1, why: "Over 80% of seed is bought — hybrids dominate paddy and vegetables. Fertiliser and pesticide use decided largely by the input dealer's advice." },
  { principleId: "soil-health", score: 2, why: "FYM applied by most households, but half the land lies bare after harvest; soil testing is rare and some upland shows sheet erosion." },
  { principleId: "animal-health", score: 2, why: "No suffering from hunger, but the veterinary hospital is 12 km away and shelters are cleaned irregularly." },
  { principleId: "biodiversity", score: 2.5, why: "Two to three crops with kitchen gardens in half the households; but pesticide use is rising and bees are scarcer than elders remember." },
  { principleId: "economic-diversification", score: 1.5, why: "Cultivation plus wage labour for most; few households run services or processing. Migration income is replacing diversification, not adding to it." },
  { principleId: "synergies", score: 3, why: "Forest, commons and farm ponds still connect the system — ponds hold water 8–10 months and the forest provides food and fodder in the rains." },
  { principleId: "co-creation", score: 2, why: "SHGs and two farmer groups exist but rarely discuss agriculture; advice flows mostly from the input dealer; women are absent from the farmer groups." },
  { principleId: "social-values-diets", score: 2.5, why: "Food-secure overall with seasonal greens and wild foods, but diet diversity dips hard in summer and processed snacks are entering children's diets." },
  { principleId: "fairness", score: 1.5, why: "Wage work is scarce outside the season; over a third of households see seasonal migration, leaving women with the farm burden. Wages remain unequal." },
  { principleId: "participation", score: 1.5, why: "Gram sabha meets, but attendance is token; planning decisions effectively made before the meeting. Women and tribal hamlets least heard." },
  { principleId: "land-governance", score: 2, why: "A forest protection committee exists for one resource, but women's representation is nominal and it lacks recognition." },
  { principleId: "connectivity", score: 1, why: "No functioning producer collective. Aggregators buy at farm gate at their price; farmers learn the market rate after they've sold." },
];

export const SCORE_THRESHOLD_LOW = 1.5; // at or below this → highlighted as entry point

// ——— Stakeholders (power × interest, 0–100 scale for plotting) ———
export type Stakeholder = {
  name: string; domain: string; power: number; interest: number; role: string;
};

export const STAKEHOLDERS: Stakeholder[] = [
  { name: "Small & marginal farmers", domain: "Producers", power: 25, interest: 88, role: "The majority of producers; most affected by input costs and farm-gate prices, least heard in planning." },
  { name: "Women farmers & SHG members", domain: "Producers", power: 20, interest: 85, role: "Carry a growing share of farm work as men migrate; organized in 14 SHGs but absent from market decisions." },
  { name: "Forest-collecting households", domain: "Producers", power: 15, interest: 75, role: "Depend on NTFP — sal leaves, mahua, tubers — especially in the lean season." },
  { name: "Input dealer (Baniadihi)", domain: "Market", power: 70, interest: 40, role: "The de-facto extension service: prescribes seed, fertiliser and pesticide dosages; credit ties farmers to him." },
  { name: "Produce aggregators", domain: "Market", power: 75, interest: 30, role: "Buy paddy and black gram at farm gate, set prices, control market information." },
  { name: "Weekly haat vendors", domain: "Market", power: 35, interest: 55, role: "Sell vegetables, dry fish, snacks; a mix of local producers and outside traders." },
  { name: "Gram Panchayat", domain: "Governance", power: 80, interest: 45, role: "Controls local planning and scheme delivery; meetings exist but participation is thin." },
  { name: "Block agriculture office", domain: "Governance", power: 65, interest: 25, role: "Extension worker visits rarely; advisories favour input-intensive packages." },
  { name: "Anganwadi & PDS dealer", domain: "Support", power: 45, interest: 60, role: "Reliable rice supply and child nutrition services; little link to local produce." },
  { name: "Local NGO (anchor)", domain: "Support", power: 50, interest: 90, role: "Two field staff; runs SHG federation support and a farmer field school in one village." },
  { name: "Youth (incl. returned migrants)", domain: "Consumers", power: 30, interest: 70, role: "Interested in agri-business and poultry; frustrated by lack of capital and market access." },
  { name: "Traditional village council", domain: "Governance", power: 60, interest: 50, role: "Informal authority on commons and disputes; gatekeeper for any village-wide exercise." },
];

// ——— Village selection matrix ———
export const VILLAGE_CRITERIA = [
  "Near main road", "Near forest/commons", "Low-income farmers", "Tribal/marginalized",
  "Upland", "Lowland", "Market in village", "Irrigation facility",
] as const;

export type Village = { name: string; flags: boolean[] }; // aligned to VILLAGE_CRITERIA

export const VILLAGES: Village[] = [
  { name: "Khetlapur", flags: [true, true, true, true, true, false, false, false] },
  { name: "Baniadihi", flags: [true, false, true, false, false, true, true, true] },
  { name: "Salbani", flags: [false, true, true, true, true, false, false, false] },
  { name: "Dumurjore", flags: [false, false, true, true, false, true, false, true] },
  { name: "Pathorkata", flags: [true, false, false, false, true, false, false, false] },
  { name: "Madhupur", flags: [false, true, true, false, false, true, false, false] },
];

// ——— Transect walk ———
export type TransectNiche = {
  id: string; name: string; soil: string; observations: string[]; change20: string;
};

export const TRANSECT: TransectNiche[] = [
  { id: "forest", name: "Ridge forest", soil: "Lateritic, gravelly", observations: ["Sal and mahua stands, degraded at edges", "Tubers, mushrooms and leafy greens gathered in monsoon", "Firewood pressure visible; protection committee patrols irregularly"], change20: "Canopy thinner; two spring-fed seeps have dried." },
  { id: "upland", name: "Upland fields", soil: "Red, light-textured", observations: ["Finger millet and black gram, mostly rainfed", "Sheet erosion rills after heavy rain", "Some field bunds broken, not repaired"], change20: "Millet area halved — shifted to paddy or fallow as labour migrated." },
  { id: "upper-paddy", name: "Upper paddy terraces", soil: "Loam, moderately fertile", observations: ["Hybrid paddy with full fertiliser dose", "Empty pesticide bottles at field corners", "FYM applied by most plots before transplanting"], change20: "Local paddy varieties almost gone; two remain with elderly farmers." },
  { id: "lower-paddy", name: "Lowland paddy", soil: "Clay, water-retaining", observations: ["Best yields; waterlogging in peak monsoon", "Fish once caught here — now rare after pesticide runoff", "Straw mostly fed to cattle, some burnt"], change20: "Waterlogging worse as upstream silt fills the drainage." },
  { id: "pond", name: "Farm ponds & stream", soil: "—", observations: ["Three ponds hold water 8–10 months", "Used for vegetables, livestock and bathing", "Silt accumulation reduces capacity"], change20: "Stream now seasonal; sand mining downstream noted." },
  { id: "homestead", name: "Homesteads & gardens", soil: "Enriched with household waste", observations: ["Half the households keep kitchen gardens — gourds, papaya, drumstick", "Poultry and goats common; sheds cleaned irregularly", "Compost pits in a third of homes; plastic waste burnt or dumped"], change20: "Gardens shrinking among migrant households; tube wells replaced two village wells." },
  { id: "commons", name: "Grazing commons", soil: "Compacted, sparse cover", observations: ["Common pasture grazed by all; no rotation", "Encroachment at two corners", "Women collect fuel and fodder daily"], change20: "Area reduced by a third; fodder gap now bought from market in summer." },
];

// ——— Seasonal calendar ———
// availability per group per season: 2 = abundant from own/local, 1 = partial/market-supplemented, 0 = scarce/market-dependent
export const SEASONS = ["Summer (Mar–Jun)", "Monsoon (Jul–Oct)", "Winter (Nov–Feb)"] as const;

export type CalendarRow = { group: string; values: [number, number, number]; note: string };

export const CALENDAR: CalendarRow[] = [
  { group: "Leafy vegetables", values: [0, 2, 2], note: "Wild and field greens flush in monsoon; summer greens only near ponds." },
  { group: "Vegetables", values: [1, 1, 2], note: "Winter is the vegetable season; summer vegetables bought from haat." },
  { group: "Fruits", values: [2, 1, 0], note: "Mango, jackfruit and mahua carry early summer; winter fruit is market-only." },
  { group: "Cereals", values: [1, 1, 2], note: "Own paddy stocks run low by May; PDS rice bridges the gap." },
  { group: "Pulses", values: [0, 1, 2], note: "Black gram harvest in early winter; stores exhausted by March." },
  { group: "Oilseeds", values: [0, 0, 1], note: "Mustard grown by few; most oil is purchased year-round." },
  { group: "Wild foods", values: [1, 2, 1], note: "Mushrooms, tubers, fish and crabs peak in monsoon; mahua in summer." },
  { group: "Crops sold", values: [0, 1, 2], note: "Paddy and black gram sold at harvest — when prices are lowest." },
  { group: "Fodder", values: [0, 2, 1], note: "Acute summer scarcity; bought or walked further for." },
  { group: "Weather stress", values: [2, 1, 0], note: "Heat and water stress in summer; erratic monsoon onset; mild winter." },
];

// ——— Service mapping ———
export type Service = { name: string; distanceKm: number; satisfaction: 1 | 2 | 3 | 4 | 5; note: string };

export const SERVICES: Service[] = [
  { name: "PDS ration shop", distanceKm: 1, satisfaction: 4, note: "Reliable rice and kerosene; quality average." },
  { name: "Anganwadi centre", distanceKm: 0.5, satisfaction: 4, note: "Hot meals regular; growth monitoring works." },
  { name: "Input dealer", distanceKm: 2, satisfaction: 3, note: "Always stocked, gives credit — but advice sells products." },
  { name: "Weekly haat", distanceKm: 4, satisfaction: 4, note: "Everything available; vegetable prices fair." },
  { name: "Primary health centre", distanceKm: 6, satisfaction: 2, note: "Doctor present twice a week; medicines often out." },
  { name: "Bank branch", distanceKm: 8, satisfaction: 2, note: "Full day lost per visit; loans need a guarantor." },
  { name: "Agriculture extension", distanceKm: 14, satisfaction: 1, note: "Officer visited once last year; no advisory reaches the village." },
  { name: "Veterinary hospital", distanceKm: 12, satisfaction: 1, note: "On-call medicine only; vaccination camps missed two seasons." },
];

// ——— Livelihood shift (households out of ~140 in Khetlapur village; income ₹k/yr) ———
export type Livelihood = { activity: string; now: number; then20: number; incomeK: number };

export const LIVELIHOODS: Livelihood[] = [
  { activity: "Crop cultivation", now: 98, then20: 126, incomeK: 38 },
  { activity: "NTFP collection", now: 35, then20: 62, incomeK: 9 },
  { activity: "Livestock (large animals)", now: 63, then20: 84, incomeK: 14 },
  { activity: "Goat & poultry rearing", now: 49, then20: 35, incomeK: 11 },
  { activity: "Village services & repair", now: 8, then20: 4, incomeK: 30 },
  { activity: "Small shops", now: 7, then20: 3, incomeK: 36 },
  { activity: "Salaried jobs", now: 6, then20: 2, incomeK: 96 },
  { activity: "Local wage labour", now: 42, then20: 28, incomeK: 22 },
  { activity: "Migrant wage labour", now: 52, then20: 12, incomeK: 55 },
];

// ——— Rapid survey: three sample households ———
export type Household = {
  name: string; profile: string;
  income: { source: string; share: number }[];
  spending: string[];
  practices: { good: string[]; concern: string[] };
};

export const HOUSEHOLDS: Household[] = [
  {
    name: "Sukhmoni's household",
    profile: "Marginal farmer, 0.8 acre upland + homestead. Husband migrates to brick kilns Dec–May.",
    income: [
      { source: "Migration remittance", share: 45 },
      { source: "Crop sale (black gram)", share: 15 },
      { source: "NTFP & goats", share: 20 },
      { source: "Local wages", share: 20 },
    ],
    spending: ["Food is the largest weekly expense once own rice runs out in April", "Loan from SHG for goat purchase at 12%/yr — and from the input dealer against harvest", "Health costs spiked last year: one hospitalization, ₹9,000"],
    practices: { good: ["Keeps own black gram seed", "Kitchen garden with 6 crops", "FYM on all plots"], concern: ["Sprays pesticide on cotton-season vegetables with no protection", "Sold black gram at farm gate, learnt the haat price later"] },
  },
  {
    name: "Budhan's household",
    profile: "Small farmer, 2.4 acres including lowland paddy. Family of six, no migration.",
    income: [
      { source: "Paddy & vegetable sale", share: 55 },
      { source: "Dairy (two cows)", share: 25 },
      { source: "Local wages", share: 20 },
    ],
    spending: ["Inputs are the biggest farm cost — ₹14,000 on fertiliser and hybrid seed", "School fees for two children in private school in Baniadihi", "Repaying a pump-set loan at 14%/yr"],
    practices: { good: ["Compost pit plus FYM", "Intercrops vegetables on bunds", "Member of the farmer group"], concern: ["Full fertiliser dose as the dealer prescribes", "Burnt paddy straw on one plot last year"] },
  },
  {
    name: "Lakhi's household",
    profile: "Landless; leases 0.5 acre lowland. Female-headed — husband works in Surat year-round.",
    income: [
      { source: "Remittance", share: 60 },
      { source: "Leased paddy", share: 10 },
      { source: "Wage labour & poultry", share: 30 },
    ],
    spending: ["Buys most food from haat year-round — own paddy lasts three months", "Lease rent paid in paddy after harvest", "Saving with SHG monthly; took a consumption loan in May"],
    practices: { good: ["Backyard poultry of local breed", "Gathers monsoon greens and mushrooms"], concern: ["No say in what the leased plot grows", "Diet diversity drops to 3 food groups in summer"] },
  },
];

// ——— Track a food: black gram → dal ———
export type ChainStep = {
  stage: string; form: string; actor: string; tech: string; waste: string;
  valuePerKg: number; challenge: string;
};

export const FOOD_CHAIN: ChainStep[] = [
  { stage: "Input", form: "Seed", actor: "Input dealer (60%) / own seed (40%)", tech: "—", waste: "—", valuePerKg: 110, challenge: "Bought seed price rises every year; own seed quality untested." },
  { stage: "Production", form: "Standing crop", actor: "Farmer (family labour)", tech: "Bullock plough, hand weeding", waste: "Crop residue → grazed in field", valuePerKg: 0, challenge: "Erratic monsoon onset shifts sowing; pod borer some years." },
  { stage: "Harvest & threshing", form: "Whole grain", actor: "Farmer + exchange labour", tech: "Manual, sun drying", waste: "Husk & straw → fodder", valuePerKg: 62, challenge: "Distress sale at harvest — cash needed for festival and loan repayment." },
  { stage: "Aggregation", form: "Whole grain (bagged)", actor: "Village aggregator", tech: "Weighing, transport by pickup", waste: "—", valuePerKg: 74, challenge: "Aggregator sets price; farmers don't know the mandi rate." },
  { stage: "Processing", form: "Split dal", actor: "Mill at block town (18 km)", tech: "Electric dal mill", waste: "Husk → sold as cattle feed; brokens → cheap dal", valuePerKg: 105, challenge: "No local mill: value addition leaves the landscape." },
  { stage: "Retail", form: "Packaged dal", actor: "Haat vendor / kirana shops", tech: "—", waste: "—", valuePerKg: 130, challenge: "The same village buys back its own black gram as dal at double the farm-gate price." },
];

// ——— KII: five informants ———
export type Informant = { who: string; principleIds: string[]; insight: string; quote: string };

export const INFORMANTS: Informant[] = [
  { who: "Input dealer, Baniadihi", principleIds: ["input-reduction"], insight: "Prescribes dosages himself, learned from company representatives. Stocks no bio-inputs — 'no demand'. Gives season credit, recovered at harvest.", quote: "Farmers come and ask: give whatever makes the paddy heavy." },
  { who: "Young entrepreneur (returned migrant)", principleIds: ["economic-diversification", "connectivity"], insight: "Started broiler poultry with savings from Surat; wants to try dal processing but the bank wants collateral he doesn't have.", quote: "Everything we grow leaves raw and comes back in a packet." },
  { who: "SHG federation leader", principleIds: ["participation", "land-governance"], insight: "14 SHGs save regularly but discuss only loans, never agriculture. Women attend gram sabha when called, but decisions are pre-made.", quote: "They want our signatures, not our opinions." },
  { who: "Anchor NGO field veteran", principleIds: ["co-creation", "participation"], insight: "One farmer field school runs in Salbani; biodiversity register started but abandoned. Local planning happens on paper to meet deadlines.", quote: "The plan is written in the block office and read out here." },
  { who: "Block extension worker", principleIds: ["input-reduction", "co-creation"], insight: "Covers 40 villages alone; visits on scheme deadlines. Advisories come pre-packaged; admits the input dealer reaches farmers first.", quote: "By the time I arrive, the spraying is already done." },
];

// ——— Market walk findings ———
export type MarketStall = { type: string; finding: string };

export const MARKET: MarketStall[] = [
  { type: "Vegetable rows", finding: "Roughly half locally grown (winter); in summer nearly all trucked from the district town. Local sellers are mostly women with small heaps." },
  { type: "Grain & dal traders", finding: "Three established traders; prices displayed nowhere. The dal sold is milled outside — including dal from this landscape's own black gram." },
  { type: "Snacks & processed", finding: "Fastest-growing section: packaged chips, biscuits, sugary drinks. Two stalls of hot fried snacks. Children's pocket money flows here." },
  { type: "Dry fish & meat", finding: "Dry fish from the coast; country chicken sells at a premium and sells out by noon — a clear local opportunity." },
  { type: "Services", finding: "A mobile-recharge table doubles as the only 'information service'. No weather or price advisory visible anywhere." },
  { type: "Who sells", finding: "Primary producers hold the cheapest spots at the market's edge; established traders hold the centre. Aggregators move through buying, not selling." },
];

// ——— Causal loop diagram ———
export type CLDNode = { id: string; label: string; x: number; y: number; leverage?: boolean };
export type CLDEdge = { from: string; to: string; sign: "+" | "-" };

export const CLD_NODES: CLDNode[] = [
  { id: "dealer", label: "Input dealer as main advisor", x: 130, y: 80 },
  { id: "inputs", label: "Dependence on purchased inputs", x: 380, y: 60 },
  { id: "soil", label: "Soil organic matter", x: 620, y: 90 },
  { id: "debt", label: "Household debt", x: 470, y: 210 },
  { id: "middlemen", label: "Sales through middlemen", x: 250, y: 260 },
  { id: "price", label: "Farm-gate prices", x: 90, y: 350 },
  { id: "migration", label: "Seasonal migration", x: 620, y: 330 },
  { id: "collectives", label: "Active producer collectives (incl. women)", x: 380, y: 400, leverage: true },
  { id: "knowledge", label: "Farmer-to-farmer knowledge sharing", x: 130, y: 470 },
  { id: "planning", label: "Community voice in local planning", x: 620, y: 470 },
];

export const CLD_EDGES: CLDEdge[] = [
  { from: "dealer", to: "inputs", sign: "+" },
  { from: "inputs", to: "debt", sign: "+" },
  { from: "inputs", to: "soil", sign: "-" },
  { from: "soil", to: "inputs", sign: "-" },
  { from: "debt", to: "middlemen", sign: "+" },
  { from: "middlemen", to: "price", sign: "-" },
  { from: "price", to: "debt", sign: "-" },
  { from: "debt", to: "migration", sign: "+" },
  { from: "migration", to: "collectives", sign: "-" },
  { from: "collectives", to: "knowledge", sign: "+" },
  { from: "knowledge", to: "dealer", sign: "-" },
  { from: "collectives", to: "middlemen", sign: "-" },
  { from: "collectives", to: "planning", sign: "+" },
  { from: "planning", to: "collectives", sign: "+" },
];

export const CLD_LOOPS = [
  { id: "R1", kind: "reinforcing" as const, label: "Input treadmill", path: ["inputs", "soil"], story: "More purchased inputs degrade soil organic matter; weaker soil demands yet more inputs. Two negative links make a vicious reinforcing loop." },
  { id: "R2", kind: "reinforcing" as const, label: "Debt–distress sale spiral", path: ["debt", "middlemen", "price"], story: "Debt forces selling through middlemen at harvest; low farm-gate prices deepen debt next season." },
  { id: "R3", kind: "reinforcing" as const, label: "Collective voice (virtuous)", path: ["collectives", "planning"], story: "Active collectives win a real voice in planning; recognition strengthens the collectives. The same reinforcing logic — pointed the right way." },
];

export const LEVERAGE_EXPLANATION =
  "Counting links, 'Active producer collectives (incl. women)' touches five connections — more than any other node. Strengthening it weakens the dealer's monopoly on advice (via knowledge sharing), bypasses middlemen (collective marketing), and builds voice in planning. It is achievable within 2–3 years — the guidebook's test for a usable leverage point.";

// ——— DQQ demo ———
export const DQQ_GROUPS = [
  { group: "Grains & staples", examples: "rice, roti, potato", khetlapur: 100 },
  { group: "Pulses", examples: "dal, chickpeas", khetlapur: 55 },
  { group: "Nuts & seeds", examples: "peanuts, jackfruit seeds", khetlapur: 20 },
  { group: "Dairy", examples: "milk, curd, paneer", khetlapur: 35 },
  { group: "Eggs", examples: "any eggs", khetlapur: 25 },
  { group: "Flesh foods", examples: "fish, chicken, meat", khetlapur: 40 },
  { group: "Dark leafy greens", examples: "saag, spinach, amaranth", khetlapur: 60 },
  { group: "Vitamin-A fruits & veg", examples: "carrot, pumpkin, ripe mango, papaya", khetlapur: 30 },
  { group: "Other vegetables", examples: "brinjal, okra, gourds, beans", khetlapur: 70 },
  { group: "Other fruits", examples: "banana, guava, apple", khetlapur: 25 },
];

export const DQQ_AVG = 4.1; // Khetlapur average food groups consumed (of 10)

// ——— Visioning ———
export type VisionGroup = { group: string; color: string; statements: string[] };

export const VISIONS: VisionGroup[] = [
  {
    group: "Youth",
    color: "coral",
    statements: [
      "Our dal mill runs in Baniadihi, and the husk feeds our own cattle.",
      "Five of us run a collection centre — the rate board hangs where everyone can read it.",
      "Nobody has to go to Surat unless they want to.",
      "The market committee gives local producers the centre stalls on Sundays.",
    ],
  },
  {
    group: "Women (35+)",
    color: "rose",
    statements: [
      "Our SHG federation sells seed we have grown and tested ourselves.",
      "The gram sabha does not start until the women's side of the floor is full.",
      "Every homestead has a garden of ten crops, and the anganwadi buys from us.",
      "The forest committee has our names in it, and the forest has water in it.",
    ],
  },
  {
    group: "Men (35+)",
    color: "peri",
    statements: [
      "Our ponds are desilted and hold water through Chaitra.",
      "We test the soil before we buy a single bag of fertiliser.",
      "The old paddy seeds are back in four fields — and they sell at a better price.",
      "Our sons farm because it pays, not because nothing else did.",
    ],
  },
];

export const VISION_ACTIONS = [
  "Register a producer collective anchored in the SHG federation — the leverage point.",
  "Start a community seed bank with the two remaining local paddy varieties.",
  "Negotiate collection-day rates with two mills; publish prices at the haat.",
  "Take the scorecard and vision to the Gram Panchayat for the annual plan.",
];
