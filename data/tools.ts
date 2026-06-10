// Tool content condensed from the AFSA Guidebook (Annexes 1–13).
// Principle references use ONLY the 13 HLPE agroecology principles.

export type Tool = {
  slug: string;
  num: number;
  name: string;
  phaseId: "pre-phase" | "scoping" | "diagnosing" | "visioning";
  oneLiner: string;
  time: string;
  materials: string;
  practicedWith: string;
  principleIds: string[];
  purpose: string;
  purposePoints: string[];
  steps: string[];
  discussion: string[];
  facilitatorNotes?: string[];
  interactive: string; // id of the interactive component
  interactiveIntro: string;
  templateRows?: string[]; // rows of the printable field template
  templateCols?: string[];
};

export const TOOLS: Tool[] = [
  {
    slug: "stakeholder-mapping",
    num: 1,
    name: "Stakeholder Mapping",
    phaseId: "pre-phase",
    oneLiner: "Who holds power, who is affected, and how decisions are made.",
    time: "2–3 hours",
    materials: "Chart paper, sticky notes, markers",
    practicedWith: "Project team and key resource people",
    principleIds: ["participation", "connectivity"],
    purpose:
      "Before any assessment, understand who shapes the food system — formally and informally, visibly and invisibly. Food systems are not experienced equally: access to food, resources and decision-making is shaped by gender, caste, class, age and ethnicity.",
    purposePoints: [
      "Identify key actors across the food system — producers, workers, traders, consumers, policymakers, traditional leaders",
      "Map power dynamics, influence and relationships among actors and institutions",
      "Surface hidden governance structures and informal norms",
      "Identify potential allies, blockers and change agents",
    ],
    steps: [
      "On sticky notes, write an extensive list of stakeholders who can influence the transformation — or be influenced by it. Groups of 3–4 can each build their own list.",
      "Differentiate stakeholders by their interest in the transformation, then by their power to influence it.",
      "Place each sticky note on an interest × power grid, sharing each actor's role as you go.",
      "From the discussion, decide who to interview further — and what your intervention might be, with whom.",
    ],
    discussion: [
      "Who makes decisions about land, food, markets or resources?",
      "Who benefits most — and who least — from the current food system?",
      "Who has formal authority vs informal influence?",
      "Which actors are connected? Which are isolated or excluded?",
      "Where are the key forums where food decisions are made?",
    ],
    facilitatorNotes: [
      "High power, high interest → manage closely. High power, low interest → keep satisfied.",
      "Low power, high interest → keep informed. Low power, low interest → monitor.",
    ],
    interactive: "stakeholder-grid",
    interactiveIntro:
      "Khetlapur's team mapped twelve actors. Click any actor to read their role — and notice who sits in the high-power, low-interest corner: that's where transformation often stalls.",
    templateCols: ["Stakeholder", "Domain", "Interest (L/M/H)", "Power (L/M/H)", "Role & notes"],
  },
  {
    slug: "village-selection",
    num: 2,
    name: "Village Selection Matrix",
    phaseId: "pre-phase",
    oneLiner: "Choose villages that together represent the whole landscape.",
    time: "2 hours",
    materials: "Chart paper",
    practicedWith: "Project team and resource people who know the landscape",
    principleIds: ["participation"],
    purpose:
      "The assessment happens in a handful of villages — so they must collectively cover all the characteristics of the landscape. Selection is done with local CSO workers and community leaders who know the terrain.",
    purposePoints: [
      "Identify representative villages or hamlets within the landscape",
      "Ensure marginalized communities, remote areas and varied agroecologies are all covered",
    ],
    steps: [
      "List all villages in the proposed landscape in column one; write selection criteria across the first row.",
      "Mark yes/no for each village against each criterion.",
      "Select villages so at least one represents each criterion — customise criteria to the landscape.",
    ],
    discussion: [
      "Are rich, middle and low-income farming areas all covered?",
      "Upland, plain and low land? Near-market and remote? Irrigated and rainfed?",
      "Are Dalit and indigenous communities represented?",
      "Villages by the road and far from it? Near forest or commons, and without?",
    ],
    interactive: "village-matrix",
    interactiveIntro:
      "Toggle the criteria below and watch which of Khetlapur's six villages qualify. The aim isn't to find one perfect village — it's a set that covers everything.",
    templateCols: ["Village", "Block", "Near road", "Near forest/commons", "Low-income farmers", "Tribal/marginalized", "Upland", "Lowland", "Market in village", "Irrigation"],
  },
  {
    slug: "transect-walk",
    num: 3,
    name: "Transect Walk",
    phaseId: "scoping",
    oneLiner: "Walk the landscape diagonally and read its ecological story.",
    time: "1.5–2 hours",
    materials: "Chart paper, notebook",
    practicedWith: "Facilitator with 5–10 community members of varied occupations",
    principleIds: ["recycling", "soil-health", "biodiversity", "synergies", "land-governance"],
    purpose:
      "A structured community walk across the village — not in a straight line, but meandering diagonally — to gather information about resources, conditions and social aspects, and to understand how people interact with their environment.",
    purposePoints: [
      "See how features and resources are spatially distributed and related",
      "Spot patterns and trends, particularly the timeline of hazards",
      "Identify problems and opportunities in resource management",
      "Surface local knowledge, practices and perspectives — include women, elders and children",
    ],
    steps: [
      "Form a small group spanning farming, fishing, animal husbandry and other occupations.",
      "Start from a corner of the village; walk a meandering, diagonal path across it.",
      "Map the route and record each ecological niche: soil, food and fodder grown, uncultivated foods, water use, ownership, waste, problems, and 20-year changes.",
      "Locate fields, homesteads, commons and water bodies; probe with open-ended questions as you walk.",
    ],
    discussion: [
      "Where are the main cereals, pulses and oilseeds grown? Vegetables?",
      "What inputs are used and where do they come from?",
      "What uncultivated foods appear in different seasons, and where?",
      "What signs of ecological degradation — and since when? What was done about it?",
      "Where does waste go? Is there composting? How clean are animal sheds?",
      "Is there a forest nearby — how healthy is it?",
    ],
    facilitatorNotes: [
      "Do: be curious, walk slowly, include village elders, reinforce good practices you see.",
      "Don't: lecture, skip the ill-maintained kitchen gardens, or pass judgment on the community.",
    ],
    interactive: "transect-strip",
    interactiveIntro:
      "This is Khetlapur's transect from the ridge forest down to the lowland paddy. Tap each niche to read what the walking team observed there.",
    templateRows: ["Soil type", "Food grown", "Fodder grown", "Uncultivated food/fodder", "Water use", "Good practices noted", "Land ownership", "Waste", "Problems observed", "Change in last 20 years", "Bees, butterflies, wildlife"],
    templateCols: ["Niche →"],
  },
  {
    slug: "dqq",
    num: 4,
    name: "Diet Quality Questionnaire",
    phaseId: "scoping",
    oneLiner: "Five minutes per person: what did you eat yesterday — and where did it come from?",
    time: "5 min per survey · ≥20 people per village",
    materials: "DQQ in the regional language, printed or electronic",
    practicedWith: "Individuals",
    principleIds: ["biodiversity", "social-values-diets"],
    purpose:
      "A 24-hour recall survey, adapted per country (India, Bangladesh, Nepal versions exist at dietquality.org), capturing consumption of key foods including processed and sugary foods. AFSA adds one column: the source of each food — own production, market, gathered, or government support.",
    purposePoints: [
      "Estimate dietary diversity (DDS, MDD) and overall diet quality (GDR score), comparable to the national average",
      "Understand market dependence vs self-sufficiency in the diet",
      "Capture protective food consumption (NCD-Protect) and unhealthy food consumption (NCD-Risk)",
    ],
    steps: [
      "Download the country-adapted DQQ (dietquality.org) in the local language.",
      "Set the survey up in KoboToolbox for offline mobile collection — data collection and aggregation happen there, not in this toolkit. (The interactive below is for learning the indicators.)",
      "Ask the respondent to recall everything eaten yesterday, from waking to night; for each food group consumed, record the source: own/farm, market, gathered, or support.",
      "Survey at least 20 community members per village, across the stratified sample.",
    ],
    discussion: [
      "How many of the 10 food groups did people consume?",
      "Which groups come from own production, which from the market?",
      "How prevalent are sugary drinks, instant noodles, packaged snacks?",
      "Is a 'fine' GDR score hiding low protective-food intake behind low junk-food intake?",
    ],
    interactive: "dqq-quiz",
    interactiveIntro:
      "Try it on yourself. Tick what you ate and drank yesterday — the panel computes the same indicators the Global Diet Quality Project reports (DDS, MDD, All-5, NCD-Protect, NCD-Risk, GDR) and compares you with Khetlapur and the India national average.",
    templateCols: ["#", "Food group (local examples)", "Yes / No", "Source: 1-Own · 2-Market · 3-Gathered · 4-Support"],
  },
  {
    slug: "kii",
    num: 5,
    name: "Key Informants' Interviews",
    phaseId: "scoping",
    oneLiner: "Deep, appreciative conversations with the people who know the system best.",
    time: "20–60 min per interview",
    materials: "Open-ended question guide, tailored per informant",
    practicedWith: "Individuals — input dealers, SHG leaders, entrepreneurs, extension workers, anchor organizations",
    principleIds: ["input-reduction", "economic-diversification", "co-creation", "participation", "land-governance", "connectivity"],
    purpose:
      "Gather in-depth qualitative insight from individuals with specific knowledge — using appreciative interviews that surface what already works, boost openness to change, and cultivate a sense of possibility.",
    purposePoints: [
      "The interviewee knows more than the interviewer — ask with respect",
      "Prepare guiding questions in advance, tailored to each informant",
      "Note non-verbal cues; much is inferred from environment and expression",
      "Keep the atmosphere relaxed, and listen far more than you speak",
    ],
    steps: [
      "Identify 'must-do' informants from the stakeholder map: input dealer, young entrepreneur, SHG leader, anchor-organization veteran, extension worker.",
      "Interview the input dealer on input decision-making and dosage advice; the entrepreneur on opportunities and pricing; the SHG leader on training, knowledge access and women's decision-making.",
      "Ask the anchor organization about community institutions, planning processes and farmer field schools.",
      "Assess the extension worker's training sources and whether local knowledge enters their advisories.",
    ],
    discussion: [
      "What decisions have you contributed to that influenced your village? How?",
      "What is the status of land ownership between large and small farmers?",
      "What challenges do women face — in income, agriculture, decision-making?",
      "What were the greatest shocks of the past 20 years, and how did the community adapt?",
    ],
    interactive: "kii-cards",
    interactiveIntro:
      "Five interviews from Khetlapur. Flip through each informant to see what they revealed — and which principle their testimony illuminates.",
    templateCols: ["Informant", "Broad topics", "Key questions", "Insights & quotes"],
  },
  {
    slug: "seasonal-calendar",
    num: 6,
    name: "Seasonal Calendar of Food",
    phaseId: "diagnosing",
    oneLiner: "A year of food, drawn on the ground: what's eaten, grown, bought — and when it runs out.",
    time: "2.5–3 hours",
    materials: "Chart paper, chalk, coloured powder/rangoli",
    practicedWith: "Facilitator with ~20–30 community members",
    principleIds: ["biodiversity", "social-values-diets", "fairness", "connectivity"],
    purpose:
      "Food and farm systems are integrally seasonal. Drawing a season × food-group calendar with the community reveals seasonal gaps, market dependence, shifting diets — and how environmental change, prices and income reshape what people eat.",
    purposePoints: [
      "Assess seasonal food gaps visually",
      "Explore shifts in availability, diversity and affordability over time",
      "Understand the community's perception of a good, healthy diet — and who can afford it",
      "Trace how environmental change and price fluctuation affect production",
    ],
    steps: [
      "Draw the seasons × food-groups table on the ground: leafy vegetables, vegetables, fruits, cereals, pulses, oilseeds, wild crops, marketed crops, fodder, weather.",
      "For each season, ask which foods of each group are consumed; write each on a slip and place it — marking market-bought foods separately.",
      "Subgroup by food group to run streams in parallel if the group is large.",
      "If women aren't participating in a mixed group, note it — and use prompting questions about land access, inheritance and decision-making roles.",
    ],
    discussion: [
      "When is there scarcity of cereals, pulses, vegetables? How do you cope?",
      "What's bought from outside — and could it be grown here? What would that take?",
      "What is a good meal? What does it cost — and who in the village can afford it?",
      "When is fodder scarce? What do you sell, and when are the income gaps?",
      "What has changed in rainfall and weather stress over 30 years?",
    ],
    interactive: "seasonal-grid",
    interactiveIntro:
      "Khetlapur's calendar across Summer, Monsoon and Winter. Toggle food groups and watch the lean season emerge — the pale cells in early summer, when home stores run out and the market takes over.",
    templateRows: ["Leafy vegetables", "Vegetables", "Fruits", "Cereals", "Pulses", "Oilseeds", "Wild crops", "Crops sold in market", "Fodder", "Weather pattern"],
    templateCols: ["Food group ↓ / Season →", "Summer", "Monsoon", "Winter"],
  },
  {
    slug: "service-mapping",
    num: 7,
    name: "Service Mapping & Ranking",
    phaseId: "diagnosing",
    oneLiner: "How far are the services that should serve you — and how good are they really?",
    time: "1.5–2 hours",
    materials: "Chart paper, chalk, coloured powder/rangoli",
    practicedWith: "Facilitator with ~10 community members",
    principleIds: ["fairness", "participation", "connectivity"],
    purpose:
      "Visually map the public and private services the community receives — extension, banks, loans, inputs, food support, insurance, markets — by distance and satisfaction. Communities often realize, in the process, the presence or absence of services they're entitled to.",
    purposePoints: [
      "Measure the distance and effectiveness of each service",
      "Highlight strengths, gaps and strategies for improvement",
      "Reveal how power, participation and inequality shape service delivery",
    ],
    steps: [
      "List all support-service nodes related to food production, processing, consumption and health; one card each.",
      "Place the community at the centre; arrange service cards at their real relative distances.",
      "Draw bigger circles around services that satisfy, smaller around those that don't.",
      "Probe on services the community doesn't list but is entitled to — including weather and market advisories.",
    ],
    discussion: [
      "What are the three most important services, in the community's view?",
      "What would the highest level of satisfaction look like for each?",
      "What steps can the community itself take to improve them?",
    ],
    interactive: "service-map",
    interactiveIntro:
      "Khetlapur's service map: distance from the village centre outward, circle size showing satisfaction. Note the agricultural extension office — far away and small.",
    templateCols: ["Service", "Distance", "Satisfaction (1–5)", "Highest expectation", "What we can do to improve it"],
  },
  {
    slug: "livelihood-shift",
    num: 8,
    name: "Livelihood Shift Mapping",
    phaseId: "diagnosing",
    oneLiner: "How households earned 20 years ago, how they earn now — and where it's heading.",
    time: "2–2.5 hours",
    materials: "Chart paper, chalk, coloured powder, small stones (optional)",
    practicedWith: "Facilitator with ~20 community members",
    principleIds: ["soil-health", "biodiversity", "economic-diversification"],
    purpose:
      "Map every livelihood activity in the village, how many households practice each today, and how many did 20 years ago. The shifts open a deeper conversation on stresses, opportunities, adaptation — and risk.",
    purposePoints: [
      "Understand how people earn and access critical inputs",
      "See the current trend of livelihood shifts — and why they're happening",
      "Discuss future possibilities and preferences",
    ],
    steps: [
      "Ask how many households the community has.",
      "List every livelihood on its own card: cultivation, NTFP collection, livestock, services, shops, salaried jobs, local and migrant wage labour.",
      "For each: households involved today, average annual income, and households involved 20 years ago — stones can stand in for numbers.",
    ],
    discussion: [
      "Why has the shift happened? What will grow in the future? What's good and bad about it?",
      "How is income leaving the village, and how is it coming in?",
      "Is income sufficient at village level? For each household?",
    ],
    interactive: "livelihood-slider",
    interactiveIntro:
      "Drag between 'then' and 'now' to watch Khetlapur's livelihoods reshape over 20 years — cultivation and forest collection shrinking, migration quadrupling.",
    templateCols: ["Livelihood activity", "Households today", "Avg annual income today", "Households 20 years ago"],
  },
  {
    slug: "rapid-survey",
    num: 9,
    name: "Rapid Survey",
    phaseId: "diagnosing",
    oneLiner: "Ten minutes per household to validate what the group exercises claimed.",
    time: "10–15 min per survey · 15–20 per village",
    materials: "Survey in the regional language, ideally on a digital platform",
    practicedWith: "Individual households",
    principleIds: ["recycling", "input-reduction", "soil-health", "animal-health", "biodiversity", "economic-diversification"],
    purpose:
      "Group exercises capture perceptions; this individual survey validates them — because income, expenditure and practices differ by class, caste and gender in ways group settings hide.",
    purposePoints: [
      "Identify income sources per household — and where income goes (food, fuel, debt, health, rituals)",
      "Visualize dependency on external markets and systems",
      "Reflect on how experience, access and gender affect food quality and availability",
    ],
    steps: [
      "Set the survey up in KoboToolbox for offline mobile collection — like the DQQ, this is a per-household digital survey collected and aggregated in Kobo, not in this toolkit.",
      "Survey crops, seasons, irrigation and livestock ownership.",
      "Record income by source (crops, NTFP, livestock, business, wages, salary, leasing, remittance), loans, reasons and interest rates; and expenditure: food and consumables (last week), utilities, rent, transport (last month), health, education, festivals (last year).",
      "Checklist production practices: seed sources and treatment, fertilisers (synthetic and bio), pest management, intercropping, mulching, residue management, kitchen gardens, marketing and group membership.",
    ],
    discussion: [
      "Does the survey confirm or contradict the group narrative?",
      "Which practices differ sharply between large and small farmers? Between men and women respondents?",
    ],
    interactive: "household-cards",
    interactiveIntro:
      "Three of Khetlapur's twenty surveyed households. Flip through their income, spending and practices — and notice how differently the same village lives.",
    templateCols: ["Section", "Questions", "Response"],
  },
  {
    slug: "track-a-food",
    num: 10,
    name: "Track a Food",
    phaseId: "diagnosing",
    oneLiner: "Follow one local food from seed to plate and watch where the value goes.",
    time: "90–120 min, possibly across days",
    materials: "Chart paper, markers",
    practicedWith: "Facilitator with ~10 community members + actor interviews",
    principleIds: ["recycling", "input-reduction", "economic-diversification", "fairness", "participation", "connectivity"],
    purpose:
      "Trace the value chain of one or two staples that are produced, processed and consumed locally — the steps, actors, technologies, energy, waste and value at every stage from input to consumer.",
    purposePoints: [
      "See what value is added at each point — and how it's shared",
      "Map technologies, energy use, and the waste each step generates",
      "Surface the gaps and challenges actors face at each stage",
    ],
    steps: [
      "Pick a staple from the seasonal calendar — a cereal, pulse or oilseed produced, processed and consumed in the village.",
      "Track its movement from harvest, noting each associated actor.",
      "Where possible, visit the processing unit and interview the actor.",
      "For each step record: activity, product form, actor, technology and energy, waste and its use, value per unit, gaps and challenges.",
    ],
    discussion: [
      "Is the pricing between actors fair?",
      "Where is value added — and where is it lost?",
      "What waste does each step generate, and how is it used?",
      "Where could energy use or waste be reduced? What technology would the community add?",
    ],
    interactive: "food-chain",
    interactiveIntro:
      "Khetlapur tracked black gram from seed to dal. Step through the chain: the farmer sells at ₹62/kg, the consumer buys processed dal at ₹130 — trace where the difference goes.",
    templateRows: ["Name of activity", "Form of the product", "Actor doing this step", "Steps performed", "Technology & energy used", "Waste product & its use", "Value per unit", "Gaps & challenges"],
    templateCols: ["Aspect ↓ / Step →", "Input", "Production", "Processing", "Storage", "Market", "Consumer"],
  },
  {
    slug: "market-walk",
    num: 11,
    name: "Market Walk",
    phaseId: "diagnosing",
    oneLiner: "A rapid appraisal of the nearest market: who sells what, from where, at what price.",
    time: "45–60 minutes",
    materials: "Notebook, checklist",
    practicedWith: "Facilitation team, during market hours",
    principleIds: ["economic-diversification", "connectivity"],
    purpose:
      "The market is where government, business and individuals connect over a product — a source of income, food, services and value exchange. A walk through it reveals the local food economy at a glance.",
    purposePoints: [
      "Type and frequency of the market",
      "Goods and services sold — and their source",
      "Are food products fresh and healthy, or sugary and processed?",
      "Do primary producers get to sell directly? How do middlemen aggregate?",
      "Price variation between formal and informal shops",
    ],
    steps: [
      "Visit the nearest market on its main day.",
      "Walk every section, noting goods, sources, freshness and prices.",
      "Talk briefly with vendors: where does this come from? Who sets the price?",
      "Note which sellers are local producers and which are traders.",
    ],
    discussion: [
      "What share of food in the market is locally produced?",
      "Where do farm-gate and market prices diverge most?",
      "What's the ratio of fresh food stalls to processed-food shops?",
    ],
    interactive: "market-scene",
    interactiveIntro:
      "Findings from Khetlapur's weekly haat at Baniadihi, 4 km away. Tap each stall type to see what the team recorded.",
    templateCols: ["Observation", "Notes"],
  },
  {
    slug: "scorecard",
    num: 12,
    name: "Agroecology Principles Scorecard",
    phaseId: "diagnosing",
    oneLiner: "All thirteen principles, scored 0–4 and drawn as one radar — the health compass of the landscape.",
    time: "3 hours",
    materials: "Chart paper, markers",
    practicedWith: "Facilitators with ~10 community representatives",
    principleIds: [
      "recycling", "input-reduction", "soil-health", "animal-health", "biodiversity",
      "economic-diversification", "synergies", "co-creation", "social-values-diets",
      "fairness", "participation", "land-governance", "connectivity",
    ],
    purpose:
      "The synthesis moment: everything learned through every tool is scored against the 13 principles (scoring based on the TAPE tool), validated with community representatives, and drawn as a radar diagram — the overall health of the landscape's food system, and the compass for designing interventions.",
    purposePoints: [
      "Analyse all participatory exercises through one agroecological lens",
      "Understand the overall situation of the landscape in a single picture",
      "Diagnose the gaps and scopes that lead into the design phase",
      "Give direction to a transformative pathway from farm to society",
    ],
    steps: [
      "For each principle, review the rubric (0–4 anchors) against evidence from the tools and secondary data.",
      "Facilitators propose a score; note on which specific account the score is good or poor.",
      "Validate every score with community representatives.",
      "Plot the 13 scores on a radar (web) diagram.",
    ],
    discussion: [
      "Which principles score lowest — and what evidence drove that?",
      "Do the community representatives recognise themselves in the picture?",
      "Which low scores will seed the causal loop diagram?",
    ],
    interactive: "scorecard-radar",
    interactiveIntro:
      "This is Khetlapur's scorecard. Drag any slider to see the radar redraw — then press 'Reset to Khetlapur' to return to the real assessment. Scores of 1 or below glow amber: those are the entry points for diagnosis.",
    templateCols: ["Principle", "Score (0–4)", "On what account good/poor", "Validated by community (Y/N)"],
  },
  {
    slug: "causal-loop",
    num: 13,
    name: "Causal Loop Diagram & Leverage Point",
    phaseId: "diagnosing",
    oneLiner: "Connect the low scores into loops — and find the one node that moves the whole system.",
    time: "60–90 minutes",
    materials: "Chart paper, markers",
    practicedWith: "Facilitator with ~10 community members",
    principleIds: ["participation", "co-creation", "connectivity"],
    purpose:
      "Causal loop diagrams visualise how variables in the system influence each other and how feedback loops drive behaviour. Starting from the scorecard's low-scoring areas, the community traces 'why has this happened, and who influences it' until the system's structure becomes visible.",
    purposePoints: [
      "Identify root causes of dysfunction — and discuss how to address them",
      "Visualise relationships, loops and direction between issues",
      "Find the leverage point: the variable with the most connections, where action ripples furthest",
    ],
    steps: [
      "Take the low-scoring principles and identify measurable variables behind them — patterns of behaviour, not one-off events.",
      "Link variables with arrows: '+' if they move together, '−' if one rises as the other falls.",
      "Stay within the landscape boundary and what you can influence.",
      "Find the node with the most connections — that's your leverage point. Prefer leverage points that can shift within 2–3 years.",
      "Read each loop: reinforcing (change compounds) or balancing (change is countered).",
    ],
    discussion: [
      "Which loops are vicious — and which could become virtuous?",
      "What actions around the leverage point would the community design?",
      "Can several loops be strung into one coherent story of the problem?",
    ],
    interactive: "causal-loop-diagram",
    interactiveIntro:
      "Khetlapur's diagnosis, drawn from its three lowest scores. Click any variable to trace its loops. The pulsing node — active, women-inclusive producer collectives — holds the most links: the leverage point.",
    templateCols: ["Variable", "Influences (→ which variable)", "Direction (+/−)", "Part of loop (R/B)"],
  },
  {
    slug: "visioning",
    num: 14,
    name: "Community Visioning & Narratives",
    phaseId: "visioning",
    oneLiner: "Three circles — youth, women, men — draw the future, then build it together.",
    time: "90–120 minutes",
    materials: "Chart paper, sketch pens, colours",
    practicedWith: "Community members in three groups: youth, women 35+, men 35+",
    principleIds: ["participation", "social-values-diets", "fairness", "co-creation"],
    purpose:
      "After diagnosis comes collective imagination. The community remembers the past, reflects on the present, envisions futures and defines a preferred one — with youth and women's world-views at the centre, since they live longest with the result.",
    purposePoints: [
      "Share the scorecard and causal loop results and gather reflection",
      "Encourage personal stories engaging past, present and future",
      "Explore alternative futures and how to facilitate the change",
      "Decide actions around the leverage point to reach the vision",
    ],
    steps: [
      "Share the Agroecology Principles Scorecard and causal loop diagram; discuss and gather input.",
      "Form three groups — youth, men above 35, women above 35 — each with a facilitator and drawing materials.",
      "Discuss: what community do you want to live in? What food, markets, forests, houses, decisions?",
      "Each group draws their future landscape — or writes positive, present-tense declarations ('The local market committee does not allow cheap calorie products from outside').",
      "Groups share with each other; the larger group lists the tasks from current to desired state — connecting them to the leverage point and ongoing program activities.",
    ],
    discussion: [
      "What does a good, just, sustainable food system look like to us?",
      "What do we want to grow, eat, trade and protect in 5–10 years?",
      "What values should guide decisions — fairness, biodiversity, reciprocity?",
      "What's already working that we should grow from?",
    ],
    interactive: "vision-voices",
    interactiveIntro:
      "What Khetlapur's three circles declared — written in the present tense, as if already true. Toggle between the voices.",
    templateCols: ["Group", "Vision statements (present tense)", "Tasks to get there", "Link to leverage point"],
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug)!;
