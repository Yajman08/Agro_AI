import type {
  FarmerProfile,
  WeatherData,
  SoilData,
  CropRecommendation,
  DiseaseResult,
  AdvisoryData,
  QuickQuestion,
  RegenerativePractice,
  SustainabilityMetric,
} from "../types";

// ----------------------------------------------------------------------------
// MOCK DATA — replace each export with a real API response as the FastAPI +
// ML services come online. Shapes intentionally match src/types/index.ts so
// no UI changes should be needed at swap time.
// ----------------------------------------------------------------------------

export const mockFarmerProfile: FarmerProfile = {
  id: "farmer_1042",
  name: "Manjunath",
  phone: "+91 90000 00000",
  location: {
    village: "Krishnarajpete",
    district: "Mandya",
    state: "Karnataka",
    country: "India",
    latitude: 12.6167,
    longitude: 76.4833,
  },
  farm: {
    sizeAcres: 2.5,
    irrigationType: "Canal",
  },
  currentCrop: "Rice",
  preferredLanguage: "Kannada",
  onboardedAt: "2026-06-02T08:15:00+05:30",
};

export const mockWeather: WeatherData = {
  location: "Krishnarajpete, Karnataka",
  now: {
    temperatureC: 28,
    condition: "Partly cloudy",
    humidityPct: 68,
    windKmh: 12,
    rainProbabilityPct: 40,
    updatedAt: "2026-09-28T09:00:00+05:30",
  },
  forecast: [
    { label: "Today", date: "Sep 28", highC: 30, lowC: 22, rainProbabilityPct: 40, condition: "Partly cloudy" },
    { label: "Tomorrow", date: "Sep 29", highC: 27, lowC: 21, rainProbabilityPct: 78, condition: "Rain likely" },
    { label: "Wed", date: "Sep 30", highC: 28, lowC: 21, rainProbabilityPct: 55, condition: "Scattered showers" },
    { label: "Thu", date: "Oct 1", highC: 29, lowC: 22, rainProbabilityPct: 20, condition: "Sunny intervals" },
    { label: "Fri", date: "Oct 2", highC: 30, lowC: 22, rainProbabilityPct: 10, condition: "Clear" },
    { label: "Sat", date: "Oct 3", highC: 31, lowC: 23, rainProbabilityPct: 15, condition: "Clear" },
  ],
  farmingImpact: [
    "Rain is expected tomorrow. Consider postponing irrigation.",
    "Humidity stays high through Wednesday — watch for early signs of fungal disease.",
    "Clear skies from Friday are a good window for spraying, if needed.",
  ],
  dataSource: "Mock weather service (sample data)",
};

export const mockSoil: SoilData = {
  healthScore: 78,
  healthLabel: "Good",
  metrics: [
    {
      key: "ph",
      label: "pH",
      value: 6.4,
      unit: "",
      rating: "good",
      range: { min: 5.5, max: 7.5 },
      meaning: "Your soil pH is suitable for several common crops, including rice and ragi.",
      action: "No correction needed right now. Re-test after the next harvest.",
    },
    {
      key: "nitrogen",
      label: "Nitrogen",
      value: 240,
      unit: "kg/ha",
      rating: "adequate",
      range: { min: 150, max: 400 },
      meaning: "Nitrogen levels are within the adequate range for your current crop.",
      action: "Apply nitrogen in split doses rather than all at once, to avoid waste.",
    },
    {
      key: "organicCarbon",
      label: "Organic Carbon",
      value: 0.8,
      unit: "%",
      rating: "adequate",
      range: { min: 0.5, max: 1.5 },
      meaning: "There is a moderate amount of organic matter to support soil life.",
      action: "Adding compost or crop residue can improve this over time.",
    },
  ],
  texture: { sand: 42, silt: 33, clay: 25 },
  dataSource: "Mock soil grid (sample data)",
  lastUpdated: "2026-09-20T00:00:00+05:30",
};

export const mockCropRecommendation: CropRecommendation = {
  primary: {
    crop: "Rice",
    confidencePct: 92,
    reasons: [
      "Suitable soil pH for paddy cultivation",
      "Suitable climate and rainfall pattern for this season",
      "Falls within the recommended sowing window for your district",
    ],
  },
  alternatives: [
    { crop: "Ragi (Finger Millet)", confidencePct: 81, reasons: ["Tolerant of variable rainfall", "Lower water requirement"] },
    { crop: "Maize", confidencePct: 74, reasons: ["Good market demand nearby", "Matches soil nitrogen levels"] },
  ],
  factorsConsidered: [
    { label: "Soil", detail: "pH, nitrogen and organic carbon from your latest soil test", supportive: true },
    { label: "Weather", detail: "Rainfall and temperature outlook for the next 90 days", supportive: true },
    { label: "Season", detail: "Kharif sowing window for Mandya district", supportive: true },
    { label: "Historical yield", detail: "Typical yields for similar farms in your taluk", supportive: true },
    { label: "Satellite vegetation", detail: "Recent vegetation health compared to nearby fields", supportive: true },
  ],
  season: "Kharif 2026",
  dataSource: "Mock crop recommendation model (sample data)",
};

export const mockDiseaseResultSick: DiseaseResult = {
  disease: "Tomato Early Blight",
  confidencePct: 91,
  observed: [
    "Dark concentric rings on the lower leaves",
    "Yellowing around the affected spots",
  ],
  actions: [
    "Remove and destroy the most affected leaves",
    "Avoid overhead watering — water at the base of the plant",
    "Apply a copper-based fungicide if the spread continues",
  ],
  prevention: [
    "Rotate crops with non-solanaceous plants next season",
    "Space plants to improve airflow",
    "Mulch to reduce soil splash onto leaves",
  ],
  isHealthy: false,
};

export const mockDiseaseResultHealthy: DiseaseResult = {
  disease: null,
  confidencePct: 96,
  observed: ["Leaf colour and structure look typical for a healthy plant"],
  actions: ["Continue your current care routine", "Recheck in 1–2 weeks or after any change in weather"],
  prevention: ["Keep monitoring lower leaves, where early symptoms usually appear first"],
  isHealthy: true,
};

export const mockAdvisory: AdvisoryData = {
  summary: "Rain tomorrow and steady soil health mean it's a good week to hold off on irrigation and fertilizer.",
  actions: [
    {
      id: "adv_1",
      category: "weather",
      priority: "high",
      title: "Postpone irrigation",
      reason: "Rain is expected tomorrow with a 78% chance, which should meet your field's water needs.",
      action: "Hold off on irrigating until after the rain, then check soil moisture before deciding further.",
      timing: "Today",
    },
    {
      id: "adv_2",
      category: "crop",
      priority: "medium",
      title: "Monitor leaves for disease",
      reason: "Humidity stays high through Wednesday, which raises the risk of fungal disease in your crop.",
      action: "Check the underside of a few lower leaves every morning this week.",
      timing: "Daily, this week",
    },
    {
      id: "adv_3",
      category: "sustainability",
      priority: "low",
      title: "Avoid excess fertilizer",
      reason: "Your soil nitrogen is already in the adequate range.",
      action: "Follow the soil-based nutrient plan instead of adding extra fertilizer this cycle.",
      timing: "This season",
    },
  ],
  generatedAt: "2026-09-28T07:00:00+05:30",
};

export const mockQuickQuestions: QuickQuestion[] = [
  {
    id: "q1",
    question: "What should I do today?",
    answer:
      "Hold off on irrigation since rain is expected tomorrow. Otherwise, no urgent action is needed today — a good day to check your lower leaves for early signs of disease.",
  },
  {
    id: "q2",
    question: "What crop should I plant?",
    answer:
      "Based on your soil and this season's weather, rice is the strongest match at 92% confidence. Ragi and maize are solid alternatives if you want to diversify.",
  },
  {
    id: "q3",
    question: "Why is my crop stressed?",
    answer:
      "We haven't detected stress in your latest check. If you're seeing yellowing or wilting, try the disease check with a leaf photo so we can look closer.",
  },
  {
    id: "q4",
    question: "How should I prepare for rain?",
    answer:
      "Postpone irrigation and fertilizer application. If drainage is a concern in your field, clear any blocked channels before the rain arrives tomorrow.",
  },
];

export const mockRegenerativePractices: RegenerativePractice[] = [
  {
    id: "rot",
    practice: "Crop rotation",
    benefit: "Breaks pest and disease cycles, and balances nutrient use across seasons.",
    whenToUse: "Plan at the start of each cropping season.",
    detail:
      "Growing a different crop family each season interrupts the pests and diseases that build up when the same crop is repeated. It also draws on different nutrients from the soil, reducing depletion.",
  },
  {
    id: "cover",
    practice: "Cover crops",
    benefit: "Protects bare soil, reduces erosion, and can add nitrogen back to the soil.",
    whenToUse: "Between main crop cycles, especially before the dry season.",
    detail:
      "Fast-growing legumes or grasses planted between main crops keep the soil covered, reduce water loss, and — in the case of legumes — fix nitrogen that the next crop can use.",
  },
  {
    id: "mulch",
    practice: "Mulching",
    benefit: "Retains soil moisture and suppresses weeds with less water use.",
    whenToUse: "Right after sowing or transplanting.",
    detail:
      "A layer of straw, leaves or crop residue on the soil surface slows evaporation, moderates soil temperature, and keeps weeds from competing with your crop for water and nutrients.",
  },
  {
    id: "compost",
    practice: "Composting",
    benefit: "Improves organic carbon and soil structure using farm waste.",
    whenToUse: "Ongoing — build compost from crop residue and manure between seasons.",
    detail:
      "Composted organic matter feeds soil microbes and improves how well your soil holds water and nutrients, reducing the need for synthetic fertilizer over time.",
  },
  {
    id: "ipm",
    practice: "Integrated pest management",
    benefit: "Reduces chemical dependency while keeping pest damage in check.",
    whenToUse: "Throughout the season, alongside regular field monitoring.",
    detail:
      "Combining regular field scouting, natural predators, and targeted treatment only when needed keeps pest damage low without relying on routine chemical spraying.",
  },
];

export const mockSustainabilityMetrics: SustainabilityMetric[] = [
  { label: "Soil health", value: 78, trend: "up" },
  { label: "Water efficiency", value: 64, trend: "flat" },
  { label: "Crop diversity", value: 45, trend: "up" },
  { label: "Organic matter", value: 58, trend: "up" },
  { label: "Reduced chemical use", value: 70, trend: "up" },
];

export const brCountries = [
  { code: "IN", name: "India", status: "Connected" as const },
  { code: "BR", name: "Brazil", status: "Framework ready" as const },
  { code: "RU", name: "Russia", status: "Framework ready" as const },
  { code: "CN", name: "China", status: "Framework ready" as const },
  { code: "ZA", name: "South Africa", status: "Framework ready" as const },
];
