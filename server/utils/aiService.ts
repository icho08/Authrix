import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const BASE_URL = "https://openrouter.ai/api/v1";

export const generateSecurityAdvice = async (scanData: any) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured in environment variables.");
  }

  const prunedData = {
    url: scanData.page?.url,
    domain: scanData.page?.domain,
    server: scanData.page?.server,
    ip: scanData.page?.ip,
    asn: scanData.meta?.processors?.asn?.data,
    stats: scanData.stats,
    verdicts: scanData.verdicts?.overall,
    topDomains: scanData.lists?.domains?.slice(0, 20),
    topIps: scanData.lists?.ips?.slice(0, 10),
  };

  const prompt = `
    You are an expert web security consultant. I am providing you with a PRUNED JSON scan result from urlscan.io for a specific domain.
    Your task is to analyze this data and provide actionable security suggestions and implementation steps to improve the website's security posture.

    Scan Data:
    ${JSON.stringify(prunedData, null, 2)}

    Please structure your response as a valid JSON object with the following keys:
    - "summary": A brief overview of the security state (2-3 sentences).
    - "riskRating": A string (e.g., "Low", "Medium", "High", "Critical").
    - "keyFindings": An array of strings describing the most important issues found.
    - "recommendations": An array of objects, each with:
        - "title": A short title for the recommendation.
        - "description": A detailed explanation of why it's important.
        - "steps": An array of specific implementation steps or changes needed.
    - "implementationTip": A technical tip for the developers.

    Respond ONLY with the JSON object.
  `;

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: "liquid/lfm-2.5-1.2b-thinking:free", 
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:3000",
          "X-Title": "Authrix Security Analysis",
        },
        timeout: 60000,
      }
    );

    const text = response.data.choices[0].message.content;
    
    // Attempt to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn("Regex matched something that wasn't valid JSON, falling back to original text.");
      }
    }
    
    return JSON.parse(text);
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error("AI Analysis timed out. The model is taking too long to respond. Please try again or switch models.");
    }
    console.error("OpenRouter AI Analysis Error:", error.response?.data || error.message);
    throw new Error("Failed to generate security advice from AI via OpenRouter.");
  }
};
