// Every number here comes from the project's own repo, README or CV. Do not add figures that cannot be checked.

export type Link = { label: string; href: string };

export type Project = {
  id: string;
  title: string;
  thai?: string;
  tagline: string;
  year: string;
  role: string;
  image: { src: string; alt: string };
  problem: string;
  built: string[];
  /** Short silent clip of the live app; `image` stays as the fallback and for reduced motion. */
  video?: { webm: string; mp4: string; poster: string };
  /**
   * ring: draw a gauge only when the value is a true share of a whole (0–100).
   * how: how the number was measured. evidence: where anyone can check it (omit if it is not public).
   */
  proof: { value: string; label: string; ring?: number; how: string; evidence?: Link }[];
  limits: string;
  stack: string[];
  links: Link[];
};

export const profile = {
  name: "Suphawit Thammarat",
  school: "B.Sc. ICT · Mahidol University · 2025–2029",
  location: "Nakhon Pathom, Thailand",
  email: "suphawit.thm@student.mahidol.ac.th",
  github: "https://github.com/SuphawitBonus",
  linkedin: "https://www.linkedin.com/in/suphawit-thammarat/",
  cv: [
    { label: "CV · Full-stack", href: "/cv/Suphawit_Thammarat_CV_FullStack.pdf" },
    { label: "CV · Data", href: "/cv/Suphawit_Thammarat_CV_Data.pdf" },
  ] satisfies Link[],
};

export const projects: Project[] = [
  {
    id: "check-before-sign",
    title: "Check Before Sign",
    thai: "เช็กก่อนเซ็น",
    tagline: "A Thai rental-contract checker that cites the law and refuses to guess.",
    year: "2026",
    role: "Personal project",
    video: { webm: "/work/check-before-sign.webm", mp4: "/work/check-before-sign.mp4", poster: "/work/check-before-sign-poster.jpg" },
    image: { src: "/work/check-before-sign.png", alt: "Check Before Sign home page: headline asking which clauses of a rental contract break the law, with a start button." },
    problem:
      "Thailand's 2025 consumer-protection notice bans lease clauses such as keeping a deposit when the tenant did nothing wrong, but renters have no quick way to check their own contract against it.",
    built: [
      "A typed TypeScript rule engine: 21 questions give a verdict for each of 18 clauses (violates, compliant or can't tell), each citing its Royal Gazette clause.",
      "\"Can't tell\" is a first-class answer. Contracts outside the law's scope or before its effective date end the questionnaire early instead of getting a wrong verdict.",
      "Everything runs in the browser. Results are shared through the URL hash, with no analytics and no third-party requests.",
    ],
    proof: [
      { value: "18", label: "legal clauses encoded", how: "One rule per clause of the 2025 notice, listed in the rental pack and checked against a Zod schema.", evidence: { label: "packs/rental/pack.json", href: "https://github.com/SuphawitBonus/check-before-sign/blob/main/packs/rental/pack.json" } },
      { value: "135", label: "unit tests", how: "Vitest across 3 test files: the engine, the rental rules, and sample answer cases. All 135 pass.", evidence: { label: "tests/", href: "https://github.com/SuphawitBonus/check-before-sign/tree/main/tests" } },
      { value: "209", label: "automated UI checks", how: "A Puppeteer script run on a production build at 375 px and 1366 px: contrast, overflow, text size, outside requests, 404. 209 pass, 0 fail.", evidence: { label: "scripts/ui-check.cjs", href: "https://github.com/SuphawitBonus/check-before-sign/blob/main/scripts/ui-check.cjs" } },
      { value: "−60%", label: "shorter home page on mobile", ring: 60, how: "Page height at 375 px measured by the same script before and after: 5,954 px to 2,403 px.", evidence: { label: "docs/report-5-cleanup.md", href: "https://github.com/SuphawitBonus/check-before-sign/blob/main/docs/report-5-cleanup.md" } },
    ],
    limits: "Checks your answers, not the contract file itself. Covers residential leases with 3+ units signed from 5 Sep 2025.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Zod 4", "Tailwind CSS", "Vitest", "Puppeteer"],
    links: [
      { label: "Live app", href: "https://check-before-sign.vercel.app" },
      { label: "Code", href: "https://github.com/SuphawitBonus/check-before-sign" },
    ],
  },
  {
    id: "totan",
    title: "Toh-Tan",
    thai: "โตทัน",
    tagline: "AI bone-age assessment for Thai children. NSC 2026, funded by NSTDA.",
    year: "2026",
    role: "Frontend developer · team of 3",
    video: { webm: "/work/totan.webm", mp4: "/work/totan.mp4", poster: "/work/totan-poster.jpg" },
    image: { src: "/work/totan.png", alt: "Toh-Tan landing page with a glowing hand X-ray and a Thai headline about tracking growth with AI." },
    problem:
      "Reading bone age from a hand X-ray is manual work that depends on specialist time, and the result then has to be explained to parents.",
    built: [
      "The Next.js web app for doctors, parents and admins: patient records, X-ray upload, Grad-CAM view, growth charts and PDF reports.",
      "Clinical maths in TypeScript: WHO growth percentiles from LMS tables, bone-age classification, and predicted vs. target adult height.",
      "Connected the UI to the team's ConvNeXt model through a Hugging Face Space and the API gateway, and prepared the training datasets.",
    ],
    proof: [
      { value: "4.61 mo", label: "model MAE on RSNA", how: "From the final project report: MAE 4.61 months (RMSE 5.85) on all 14,236 RSNA images, and 6.21 months on 1,203 DHA images. The live site shows 4.36, the MAE on the held-out test split." },
      { value: "77.8", label: "SUS usability score, 50 users", ring: 77.8, how: "From the final project report: System Usability Scale (0–100), mean 77.8 (SD 15.1) across 50 users. Parents 79.4 (n = 43), clinicians 68.6 (n = 7); the industry average is about 68." },
      { value: "NSTDA", label: "development grant", how: "The project is supported by Thailand's National Science and Technology Development Agency under NSC 2026; the app's licence notice says so.", evidence: { label: "Disclaimer.tsx", href: "https://github.com/SuphawitBonus/totan-nsc2026/blob/master/apps/web/src/components/Disclaimer.tsx" } },
      { value: "Regional", label: "round, NSC 2026", how: "Toh-Tan advanced to the regional round of the National Software Contest 2026." },
    ],
    limits: "Built to support clinicians, not to replace a doctor's reading.",
    stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Hugging Face", "Microservices"],
    links: [
      { label: "Live app", href: "https://totan-nsc2026-web.vercel.app" },
      { label: "Code", href: "https://github.com/SuphawitBonus/totan-nsc2026" },
    ],
  },
  {
    id: "road-deaths",
    title: "Bangkok Road Deaths",
    tagline: "Fourteen years of open data, cleaned, tested, mapped in 3D and queryable in plain language.",
    year: "2026",
    role: "Personal project",
    video: { webm: "/work/road-deaths.webm", mp4: "/work/road-deaths.mp4", poster: "/work/road-deaths-poster.jpg" },
    image: { src: "/work/road-deaths.png", alt: "3D hexagon map of road deaths across Bangkok with a yearly bar chart and filters in a side panel." },
    problem:
      "The government's road-death data is messy: coordinates swapped, and half the rows have no vehicle type. Charts built on it quietly mislead.",
    built: [
      "Cleaned and analysed 12,146 records with pandas and SciPy, fixed 479 swapped coordinates and stated the denominator wherever data was missing.",
      "A live 3D map with deck.gl and H3. Production stores only per-hexagon monthly counts behind a SELECT-only role, and cells under 3 deaths are hidden.",
      "A Claude tool-use text-to-SQL backend behind a SQL guard, checked by a 50-question Thai/English eval with an independent Python cross-check.",
    ],
    proof: [
      { value: "12,146", label: "records cleaned", how: "Rows in the Department of Disease Control's open data for Bangkok, 2011–2026, after cleaning; 479 swapped coordinates were fixed.", evidence: { label: "Notebook", href: "https://github.com/SuphawitBonus/NeXT-Traffic/blob/main/analysis/bangkok-road-deaths.ipynb" } },
      { value: "92.5%", label: "of deaths with a known vehicle were motorcycles", ring: 92.5, how: "5,383 of the 5,818 deaths that record a vehicle type (about half the rows do not). 95% confidence interval: 91.8–93.2%, computed in the notebook.", evidence: { label: "Notebook", href: "https://github.com/SuphawitBonus/NeXT-Traffic/blob/main/analysis/bangkok-road-deaths.ipynb" } },
      { value: "p = 0.155", label: "14-year trend, not significant", how: "Linear regression on yearly deaths: −5.9 per year, p = 0.155, R² = 0.161. p is above 0.05, so the decline could be chance, and the notebook says so.", evidence: { label: "Notebook", href: "https://github.com/SuphawitBonus/NeXT-Traffic/blob/main/analysis/bangkok-road-deaths.ipynb" } },
      { value: "50", label: "eval questions", how: "50 Thai and English questions with expected answers; an independent Python implementation cross-checks the SQL results.", evidence: { label: "evals/questions.jsonl", href: "https://github.com/SuphawitBonus/bangkok-road-deaths-chat/blob/main/evals/questions.jsonl" } },
    ],
    limits: "Only 64% of 2011–2024 deaths have coordinates. The map shows those and says so on screen.",
    stack: ["Python", "pandas", "SciPy", "Next.js", "MapLibre", "deck.gl", "H3", "Postgres (Neon)", "Claude API"],
    links: [
      { label: "Live map", href: "https://bangkok-road-deaths-chat.vercel.app" },
      { label: "Code", href: "https://github.com/SuphawitBonus/bangkok-road-deaths-chat" },
      { label: "Notebook", href: "https://github.com/SuphawitBonus/NeXT-Traffic/blob/main/analysis/bangkok-road-deaths.ipynb" },
    ],
  },
  {
    id: "nexttraffic",
    title: "NextTraffic",
    tagline: "Live Bangkok traffic, with vehicles counted in the browser.",
    year: "2026",
    role: "Personal project",
    video: { webm: "/work/nexttraffic.webm", mp4: "/work/nexttraffic.mp4", poster: "/work/nexttraffic-poster.jpg" },
    image: { src: "/work/nexttraffic.png", alt: "NextTraffic dark dashboard: headline about Bangkok traffic and flood data, with question cards for each kind of user." },
    problem:
      "Bangkok's traffic and flood data is scattered across agencies, and it is hard to tell which dataset can actually answer your question.",
    built: [
      "Live CCTV (HLS) on a Leaflet map, with vehicles counted by TensorFlow.js COCO-SSD on WebGL, so no video leaves the device.",
      "A serverless API on Vercel that streams Claude answers with per-IP rate limiting and falls back to a cached data snapshot.",
      "A question-first catalog: pick a decision, see which dataset answers it and what it cannot tell you.",
    ],
    proof: [
      { value: "0", label: "video frames sent to a server", how: "COCO-SSD runs in the browser with TensorFlow.js on WebGL and reads the video element locally; there is no upload code.", evidence: { label: "vehicleDetection.js", href: "https://github.com/SuphawitBonus/NeXT-Traffic/blob/main/src/lib/vehicleDetection.js" } },
      { value: "5", label: "real datasets", how: "Datasets in the catalog that are not marked as mock: 6 in total, 1 simulated and labelled as such.", evidence: { label: "catalog.js", href: "https://github.com/SuphawitBonus/NeXT-Traffic/blob/main/src/data/catalog.js" } },
      { value: "Per-IP", label: "rate limiting", how: "The serverless AI endpoint limits requests per IP before calling the model, so one visitor cannot run up the bill.", evidence: { label: "api/ask.js", href: "https://github.com/SuphawitBonus/NeXT-Traffic/blob/main/api/ask.js" } },
    ],
    limits: "Simulated data is labelled on screen wherever no real feed exists yet.",
    stack: ["React", "Vite", "Leaflet", "hls.js", "TensorFlow.js", "Vercel Functions", "Claude API"],
    links: [
      { label: "Live app", href: "https://nexttraffic.vercel.app" },
      { label: "Code", href: "https://github.com/SuphawitBonus/NeXT-Traffic" },
    ],
  },
];

export const moreWork = [
  {
    title: "Algorithmic trading bots",
    note: "Paper and demo accounts only",
    text: "Two typed Python bots (Pydantic, mypy, pytest) for Binance futures and MetaTrader 5, with a risk governor and kill switch. Found that the backtest's 100% win rate came from averaging down, with ETH drawdown reaching 176% of capital.",
    links: [
      { label: "bot-trader", href: "https://github.com/SuphawitBonus/bot-trader" },
      { label: "forex-bot", href: "https://github.com/SuphawitBonus/forex-bot" },
    ],
  },
  {
    title: "KGI ALGO Trading Competition 2026",
    note: "Solo entrant · ongoing",
    text: "An automated strategy for SET-listed stocks on a ฿10M simulated portfolio, built on Python backtests and a pre-submission checker.",
    links: [] as Link[],
  },
  {
    title: "Treasurer, ICT Student Union",
    note: "Mahidol University · 2026–2027",
    text: "Managed ฿484,600 across Mahidol Open House 2026 (335 organizers) and Welcome Freshy 2026, with Excel dashboards comparing allocated and actual spend.",
    links: [] as Link[],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Vite", "Recharts", "Leaflet", "MapLibre", "deck.gl"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "SQLite", "Zod", "REST APIs", "Docker"] },
  { group: "Data", items: ["Python", "pandas", "NumPy", "SciPy", "SQL", "Jupyter", "Excel"] },
  { group: "Quality", items: ["Vitest", "pytest", "Puppeteer", "Playwright", "mypy", "WCAG AA"] },
  { group: "AI", items: ["Claude API", "TensorFlow.js", "Hugging Face"] },
];
