export interface OpenAIInsightPayload {
  user: {
    login: string;
    name: string | null;
    bio: string | null;
    followers: number;
    public_repos: number;
    company: string | null;
  };
  score: number;
  breakdown: Record<string, number>;
  languages: Array<{ name: string; percentage: number }>;
  topRepos: Array<{ name: string; description: string | null; language: string | null; stars: number; forks: number }>;
  companyName?: string;
}

function extractJson(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/```\s*([\s\S]*?)```/i);
  if (fenced) return JSON.parse(fenced[1].trim());
  return JSON.parse(trimmed);
}

function buildGeminiRequestText(schema: Record<string, unknown>, payload: OpenAIInsightPayload | (OpenAIInsightPayload & { companyName: string })) {
  return JSON.stringify({
    task: 'Analyze this developer profile and return valid JSON only.',
    schema,
    payload,
  });
}

async function callGemini(text: string, temperature = 0.4) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text }],
      }],
      generationConfig: {
        temperature,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gemini API failed: ${error}`);
  }

  const data = await res.json();
  const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  return extractJson(candidateText);
}

export async function getOpenAIAnalysis(payload: OpenAIInsightPayload) {
  const prompt = buildGeminiRequestText({
    summary: 'string',
    keyStrengths: ['string'],
    risks: ['string'],
    actionPlan: [{ title: 'string', description: 'string', steps: ['string'] }],
    companyMatches: [{ name: 'string', domain: 'string', fitScore: 0, reason: 'string' }],
  }, payload);

  return callGemini(prompt, 0.4);
}

export async function getOpenAICompanyQualification(payload: OpenAIInsightPayload & { companyName: string }) {
  const prompt = buildGeminiRequestText({
    company: 'string',
    probability: 0,
    verdict: 'string',
    message: 'string',
  }, payload);

  return callGemini(prompt, 0.3);
}
